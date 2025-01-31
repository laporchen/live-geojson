<script setup lang="ts">
import type { Doc, Array as YArray } from 'yjs'

const props = defineProps<{
  roomId: string
}>()
const baseGeoJson =  {
  "type": "FeatureCollection",
  "features": []
}
const geojson = ref<Record<string, any>>(baseGeoJson)

const { initWs } = useWs()
const mapObj = ref()
const docRef = ref<Doc>()

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const { wsProvider: ws, doc } = initWs(protocol, window.location.host, props.roomId)
  ws.on('status', event => {
    console.log('status change', event.status)
  })
  // init doc
  const map = doc.getMap('map')
  if (!map.has('FeatureCollection')) map.set('type', 'FeatureCollection')
  if (!map.has('features')) map.set('features', [])
  map.observeDeep(() => {
    geojson.value = map.toJSON()
  })

  docRef.value = doc
})

const onMapReady = (mapInst: any) => {
  mapInst!.on('click', (evt: any) => {
    const { lat, lng } = evt.latlng
    const point = {
      type: 'Feature',
      properties: {
        id: Math.floor(Math.random() * 10000)
      },
      geometry: {
        coordinates: [ lat, lng ],
        type: 'Point'
      }
    }
    const features = docRef.value?.getMap('map').get('features') as Array<any>
    features?.push(point)
    docRef.value!.getMap('map').set('features', features)
  })
}

const getFeatures = () => {
  return (docRef.value?.getMap('map').get('features') ?? []) as Array<any>
}

const onMarkerUpdate = (evt: any, id: number) => {
  const { lat, lng } = evt.target.getLatLng()
  const features = getFeatures()
  const targetIndex = features.findIndex((feature) => feature.properties.id === id)
  if (targetIndex === -1) return
  features[targetIndex].geometry.coordinates = [lat, lng]
  docRef.value!.getMap('map').set('features', features)
}

const deleteMarker = (id: number) => {
  const features = getFeatures()
  const newFeatures = features.filter((feature) => feature.properties.id !== id)
  docRef.value!.getMap('map').set('features', newFeatures)
}
</script>
<template>
  <LMap
    ref="mapObj"
    style="height: 98dvh"
    :zoom="6"
    :center="[47.21322, -1.559482]"
    :use-global-leaflet="false"
    @ready="onMapReady"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
      layer-type="base"
      name="OpenStreetMap"
    />
    <template v-for="point in geojson.features" :key="point.properties.id">
      <LMarker :lat-lng="point.geometry.coordinates" draggable @moveend="(evt: any) => onMarkerUpdate(evt, point.properties.id)">
        <LPopup> 
          <div>
            {{ point.properties.id }}
            <button @click="() => deleteMarker(point.properties.id)">
              Delete
            </button>
          </div>
        </LPopup>
      </LMarker>
    </template>
  </LMap>
</template>
