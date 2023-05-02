import {LandscapeFactory, Landscapes} from '../../interfaces/hex.interfaces'

export const ROTATION_DEG = [0, 60, 120, 180, 240, 300] as const

const TRAVEL_SPEEDS = {
  VERY_FAST: 1,
  FAST: 0.8,
  NORMAL: 0.6,
  SLOW: 0.5,
  VERY_SLOW: 0.4,
  ZERO: 0
}

export const landscapeFactory: LandscapeFactory = {
  createLandsCore: (imageName: string) => ({
    imageName,
    name: 'Сердце земель',
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_FAST,
    isViewObstacle: false,
    description: ''
  }),
  createMeadow: (imageName: string) => ({
    imageName,
    name: 'Луг',
    color: '#668646',
    travelSpeed: TRAVEL_SPEEDS.SLOW,
    isViewObstacle: false,
    description: 'Можно собирать различные травы'
  }),
  createGround: (imageName: string) => ({
    imageName,
    name: 'Земля',
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.SLOW,
    isViewObstacle: false,
    description: 'Здесь можно строить'
  }),
  createGardenBed: (imageName: string) => ({
    imageName,
    name: 'Засеяннное поле',
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description: ''
  }),
  createWheat: (imageName: string) => ({
    imageName,
    name: 'Пшеница',
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description: ''
  }),
  createGrove: (imageName: string) => ({
    imageName,
    name: 'Роща',
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description: 'Если сохранить, здесь вырастет новый лес'
  }),
  createForest: (imageName: string) => ({
    imageName,
    name: 'Лес',
    color: '#57582b',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description:
      'Можно добывать дерево. Если не вырубать, рядом может вырасти роща'
  }),
  createStones: (imageName: string) => ({
    imageName,
    name: 'Камни',
    color: '#57582b',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: 'Можно добывать камень для строительства'
  }),
  createStonePlateau: (imageName: string) => ({
    imageName,
    name: 'Каменное плато',
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description:
      'Можно добывать камень для строительства. Позволяет перемещаться по поверхности'
  }),
  createRoad: (imageName: string) => ({
    imageName,
    name: 'Дорога',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.VERY_FAST,
    isViewObstacle: false,
    description: ''
  }),
  createPath: (imageName: string) => ({
    imageName,
    name: 'Тропа',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.FAST,
    isViewObstacle: false,
    description: ''
  }),
  createPathInForest: (imageName: string) => ({
    imageName,
    name: 'Тропа через лес',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.FAST,
    isViewObstacle: true,
    description: ''
  }),
  createSource: (imageName: string) => ({
    imageName,
    name: 'Источник',
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: ''
  }),
  createRiver: (imageName: string) => ({
    imageName,
    name: 'Река',
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: false,
    description: ''
  }),
  createRiverInForest: (imageName: string) => ({
    imageName,
    name: 'Река в лесу',
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: ''
  }),
  createRapid: (imageName: string) => ({
    imageName,
    name: 'Порог',
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: ''
  }),
  createStoneBridge: (imageName: string) => ({
    imageName,
    name: 'Каменный мост',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.FAST,
    isViewObstacle: false,
    description: ''
  }),
  createStoneRoadFord: (imageName: string) => ({
    imageName,
    name: 'Брод',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.SLOW,
    isViewObstacle: false,
    description: ''
  }),
  createWoodenBridge: (imageName: string) => ({
    imageName,
    name: 'Деревянный мост',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.NORMAL,
    isViewObstacle: false,
    description: ''
  }),
  createPathFord: (imageName: string) => ({
    imageName,
    name: 'Брод',
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description: ''
  }),
  createLake: (imageName: string) => ({
    imageName,
    name: 'Озеро',
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: false,
    description: ''
  }),
  createSwamp: (imageName: string) => ({
    imageName,
    name: 'Болото',
    color: '#57582b',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: false,
    description: ''
  }),
  createSea: (imageName: string) => ({
    imageName,
    name: 'Море',
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: false,
    description: ''
  }),
  createShore: (imageName: string) => ({
    imageName,
    name: 'Побережье',
    color: '#668646',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: false,
    description: ''
  })
}

const MEADOW_1 = landscapeFactory.createMeadow('meadow1.png')
const MEADOW_2 = landscapeFactory.createMeadow('meadow2.png')
const MEADOW_3 = landscapeFactory.createMeadow('meadow3.png')
const MEADOW_4 = landscapeFactory.createMeadow('meadow4.png')
const GROUND = landscapeFactory.createGround('ground1.png')
const GARDEN_BED = landscapeFactory.createGardenBed('gardenBed1.png')
const WHEAT = landscapeFactory.createWheat('wheat1.png')
const GROVE = landscapeFactory.createGrove('grove1.png')
const FOREST_1 = landscapeFactory.createForest('forest1.png')
const FOREST_2 = landscapeFactory.createForest('forest2.png')
const STONES_1 = landscapeFactory.createStones('stone1.png')
const STONES_2 = landscapeFactory.createStones('stone2.png')
const STONE_PLATEAU = landscapeFactory.createStonePlateau('stone3.png')
const ROAD_1 = landscapeFactory.createRoad('road1.png')
const ROAD_2 = landscapeFactory.createRoad('road2.png')
const ROAD_3 = landscapeFactory.createRoad('road3.png')
const ROAD_4 = landscapeFactory.createRoad('road4.png')
const ROAD_5 = landscapeFactory.createRoad('road5.png')
const ROAD_6 = landscapeFactory.createRoad('road6.png')
const ROAD_7 = landscapeFactory.createRoad('road7.png')
const ROAD_8 = landscapeFactory.createRoad('road8.png')
const PATH_1 = landscapeFactory.createPath('path1.png')
const PATH_2 = landscapeFactory.createPath('path2.png')
const PATH_3 = landscapeFactory.createPath('path3.png')
const PATH_4 = landscapeFactory.createPath('path4.png')
const PATH_5 = landscapeFactory.createPath('path5.png')
const PATH_6 = landscapeFactory.createPath('path6.png')
const PATH_7 = landscapeFactory.createPath('path7.png')
const PATH_8 = landscapeFactory.createPath('path8.png')
const PATH_IN_FOREST_1 = landscapeFactory.createPathInForest('path9.png')
const PATH_IN_FOREST_2 = landscapeFactory.createPathInForest('path10.png')
const SOURCE = landscapeFactory.createSource('source1.png')
const RIVER_1 = landscapeFactory.createRiver('river1.png')
const RIVER_2 = landscapeFactory.createRiver('river2.png')
const RIVER_3 = landscapeFactory.createRiver('river3.png')
const RIVER_4 = landscapeFactory.createRiver('river4.png')
const RIVER_5 = landscapeFactory.createRiver('river5.png')
const RIVER_6 = landscapeFactory.createRiver('river6.png')
const RIVER_7 = landscapeFactory.createRiver('river7.png')
const RIVER_8 = landscapeFactory.createRiver('river8.png')
const RIVER_IN_FOREST = landscapeFactory.createRiverInForest('river9.png')
const RAPID = landscapeFactory.createRapid('rapid1.png')
const STONE_BRIDGE = landscapeFactory.createStoneBridge('bridge1.png')
const STONE_ROAD_FORD = landscapeFactory.createStoneRoadFord('bridge2.png')
const WOODEN_BRIDGE_1 = landscapeFactory.createWoodenBridge('bridge3.png')
const WOODEN_BRIDGE_2 = landscapeFactory.createWoodenBridge('bridge4.png')
const PATH_FORD = landscapeFactory.createPathFord('bridge5.png')
const LAKE_1 = landscapeFactory.createLake('lake1.png')
const LAKE_2 = landscapeFactory.createLake('lake2.png')
const SWAMP = landscapeFactory.createSwamp('swamp1.png')
const LANDS_CORE = landscapeFactory.createLandsCore('landsCore1.png')
const SEA_1 = landscapeFactory.createSea('sea1.png')
const SEA_2 = landscapeFactory.createSea('sea2.png')
const SEA_3 = landscapeFactory.createSea('sea3.png')
const SEA_4 = landscapeFactory.createSea('sea4.png')
const SEA_5 = landscapeFactory.createSea('sea5.png')
const SEA_6 = landscapeFactory.createSea('sea6.png')
const SHORE_1 = landscapeFactory.createShore('shore1.png')
const SHORE_2 = landscapeFactory.createShore('shore2.png')
const SHORE_3 = landscapeFactory.createShore('shore3.png')
const SHORE_4 = landscapeFactory.createShore('shore4.png')
const SHORE_5 = landscapeFactory.createShore('shore5.png')
const SHORE_6 = landscapeFactory.createShore('shore6.png')
const SHORE_7 = landscapeFactory.createShore('shore7.png')
const SHORE_8 = landscapeFactory.createShore('shore8.png')
const SHORE_9 = landscapeFactory.createShore('shore9.png')
const SHORE_10 = landscapeFactory.createShore('shore10.png')
const SHORE_11 = landscapeFactory.createShore('shore11.png')
const SHORE_12 = landscapeFactory.createShore('shore12.png')
const SHORE_13 = landscapeFactory.createShore('shore13.png')
const SHORE_14 = landscapeFactory.createShore('shore14.png')
const SHORE_15 = landscapeFactory.createShore('shore15.png')
const SHORE_16 = landscapeFactory.createShore('shore16.png')
const SHORE_17 = landscapeFactory.createShore('shore17.png')
const SHORE_18 = landscapeFactory.createShore('shore18.png')
const SHORE_19 = landscapeFactory.createShore('shore19.png')
const SHORE_20 = landscapeFactory.createShore('shore20.png')
const SHORE_21 = landscapeFactory.createShore('shore21.png')
const SHORE_22 = landscapeFactory.createShore('shore22.png')

export const LANDSCAPES: Landscapes = {
  MEADOW_1,
  MEADOW_2,
  MEADOW_3,
  MEADOW_4,
  GROUND,
  GARDEN_BED,
  WHEAT,
  GROVE,
  FOREST_1,
  FOREST_2,
  STONES_1,
  STONES_2,
  STONE_PLATEAU,
  ROAD_1,
  ROAD_2,
  ROAD_3,
  ROAD_4,
  ROAD_5,
  ROAD_6,
  ROAD_7,
  ROAD_8,
  PATH_1,
  PATH_2,
  PATH_3,
  PATH_4,
  PATH_5,
  PATH_6,
  PATH_7,
  PATH_8,
  PATH_IN_FOREST_1,
  PATH_IN_FOREST_2,
  SOURCE,
  RIVER_1,
  RIVER_2,
  RIVER_3,
  RIVER_4,
  RIVER_5,
  RIVER_6,
  RIVER_7,
  RIVER_8,
  RIVER_IN_FOREST,
  RAPID,
  STONE_BRIDGE,
  STONE_ROAD_FORD,
  WOODEN_BRIDGE_1,
  WOODEN_BRIDGE_2,
  PATH_FORD,
  LAKE_1,
  LAKE_2,
  SWAMP,
  LANDS_CORE,
  SEA_1,
  SEA_2,
  SEA_3,
  SEA_4,
  SEA_5,
  SEA_6,
  SHORE_1,
  SHORE_2,
  SHORE_3,
  SHORE_4,
  SHORE_5,
  SHORE_6,
  SHORE_7,
  SHORE_8,
  SHORE_9,
  SHORE_10,
  SHORE_11,
  SHORE_12,
  SHORE_13,
  SHORE_14,
  SHORE_15,
  SHORE_16,
  SHORE_17,
  SHORE_18,
  SHORE_19,
  SHORE_20,
  SHORE_21,
  SHORE_22
}
