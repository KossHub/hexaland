import {TemplateTypes} from '../../interfaces/hex.interfaces'

export interface Landscapes {
  [key: string]: {
    name: string
    images: string[]
    color: string
    travelSpeed: number | number[] // 6 values corresponding to CUBE_DIRECTION_VECTORS
    isViewObstacle: boolean
    description: string
  }
}

const TRAVEL_SPEEDS = {
  VERY_FAST: 1,
  FAST: 0.8,
  MIDDLE: 0.6,
  SLOW: 0.5,
  VERY_SLOW: 0.4,
  ZERO: 0
}

export const LANDSCAPES: Landscapes = {
  MEADOW: {
    name: 'Луг',
    images: ['meadow1.png', 'meadow2.png', 'meadow3.png', 'meadow4.png'],
    color: '#668646',
    travelSpeed: TRAVEL_SPEEDS.SLOW,
    isViewObstacle: false,
    description: 'Можно собирать различные травы'
  },
  GROVE: {
    name: 'Роща',
    images: ['grove1.png'],
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description: 'Если сохранить, здесь вырастет новый лес'
  },
  FOREST: {
    name: 'Лес',
    images: ['forest1.png', 'forest2.png'],
    color: '#57582b',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description:
      'Можно добывать дерево. Если не вырубать, рядом может вырасти роща'
  },
  STONES: {
    name: 'Камни',
    images: ['stone1.png', 'stone2.png'],
    color: '#57582b',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: 'Можно добывать камень для строительства'
  },
  STONE_PLATEAU: {
    name: 'Каменное плато',
    images: ['stone3.png'],
    color: '#5f6c38',
    travelSpeed: TRAVEL_SPEEDS.VERY_SLOW,
    isViewObstacle: false,
    description:
      'Можно добывать камень для строительства. Позволяет перемещаться по поверхности'
  },
  ROAD: {
    name: 'Дорога',
    images: [
      'road1.png',
      'road2.png',
      'road3.png',
      'road4.png',
      'road5.png',
      'road6.png',
      'road7.png',
      'road8.png'
    ],
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.VERY_FAST,
    isViewObstacle: false,
    description: 'Лес вдоль дороги не вырастет'
  },
  PATH: {
    name: 'Тропа',
    images: [
      'path1.png',
      'path2.png',
      'path3.png',
      'path4.png',
      'path5.png',
      'path6.png',
      'path7.png'
    ],
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.FAST,
    isViewObstacle: false, // TODO: Separate PATH_WITH_FOREST, PATH_WITH_GROVE
    description: ''
  },
  SOURCE: {
    name: 'Источник',
    images: ['source1.png'],
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: 'Здесь можно восстановить силы'
  },
  RIVER: {
    name: 'Река',
    images: [
      'river1.png',
      'river2.png',
      'river3.png',
      'river4.png',
      'river5.png',
      'river6.png',
      'river7.png',
      'river8.png',
      'river9.png',
      'river10.png'
    ],
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: false,
    description: 'Выберите подходящее место реки, чтобы построить мост'
  },
  RAPID: {
    name: 'Порог',
    images: ['rapid1.png'],
    color: '#48929f',
    travelSpeed: TRAVEL_SPEEDS.ZERO,
    isViewObstacle: true,
    description: ''
  },
  STONE_BRIDGE: {
    name: 'Каменный мост',
    images: ['bridge1.png'],
    color: '#8d8071',
    travelSpeed: TRAVEL_SPEEDS.FAST,
    isViewObstacle: false,
    description: ''
  },
  STONE_BRIDGE: {
    name: 'Каменный мост',
    images: ['bridge1.png'],
    color: '#8d8071',
    travelSpeed: 0,
    isViewObstacle: false,
    description: ''
  }
}

export const LANDSCAPE_TYPES: TemplateTypes = {
  GRASS_1: {
    detailed: 'grass1.png',
    simplified: '#668646'
  },
  GRASS_2: {
    detailed: 'grass2.png',
    simplified: '#668646'
  },
  GRASS_3: {
    detailed: 'grass3.png',
    simplified: '#668646'
  },
  GRASS_4: {
    detailed: 'grass4.png',
    simplified: '#668646'
  },
  BUSHES_1: {
    detailed: 'bushes1.png',
    simplified: '#5f6c38'
  },
  TREES_1: {
    detailed: 'trees1.png',
    simplified: '#57582b'
  },
  TREES_2: {
    detailed: 'trees2.png',
    simplified: '#57582b'
  },
  STONE_1: {
    detailed: 'stone1.png',
    simplified: '#57582b'
  },
  STONE_2: {
    detailed: 'stone2.png',
    simplified: '#57582b'
  },
  STONE_3: {
    detailed: 'stone3.png',
    simplified: '#57582b'
  },
  ROAD_1: {
    detailed: 'road1.png',
    simplified: '#8d8071'
  },
  ROAD_2: {
    detailed: 'road2.png',
    simplified: '#8d8071'
  },
  ROAD_3: {
    detailed: 'road3.png',
    simplified: '#8d8071'
  },
  ROAD_4: {
    detailed: 'road4.png',
    simplified: '#8d8071'
  },
  ROAD_5: {
    detailed: 'road5.png',
    simplified: '#8d8071'
  },
  ROAD_6: {
    detailed: 'road6.png',
    simplified: '#8d8071'
  },
  ROAD_7: {
    detailed: 'road7.png',
    simplified: '#8d8071'
  },
  ROAD_8: {
    detailed: 'road8.png',
    simplified: '#8d8071'
  },
  PATH_1: {
    detailed: 'path1.png',
    simplified: '#8d8071'
  },
  PATH_2: {
    detailed: 'path2.png',
    simplified: '#8d8071'
  },
  PATH_3: {
    detailed: 'path3.png',
    simplified: '#8d8071'
  },
  /** FIXME: To remove ? */
  PATH_4: {
    detailed: 'path4.png',
    simplified: '#8d8071'
  },
  PATH_5: {
    detailed: 'path5.png',
    simplified: '#8d8071'
  },
  PATH_6: {
    detailed: 'path6.png',
    simplified: '#8d8071'
  },
  PATH_7: {
    detailed: 'path7.png',
    simplified: '#8d8071'
  },
  PATH_8: {
    detailed: 'path8.png',
    simplified: '#8d8071'
  },
  SOURCE_1: {
    detailed: 'source1.png',
    simplified: '#48929f'
  },
  RIVER_1: {
    detailed: 'river1.png',
    simplified: '#48929f'
  },
  RIVER_2: {
    detailed: 'river2.png',
    simplified: '#48929f'
  },
  RIVER_3: {
    detailed: 'river3.png',
    simplified: '#48929f'
  },
  RIVER_4: {
    detailed: 'river4.png',
    simplified: '#48929f'
  },
  RIVER_5: {
    detailed: 'river5.png',
    simplified: '#48929f'
  },
  RIVER_6: {
    detailed: 'river6.png',
    simplified: '#48929f'
  },
  RIVER_7: {
    detailed: 'river7.png',
    simplified: '#48929f'
  },
  RIVER_8: {
    detailed: 'river8.png',
    simplified: '#48929f'
  },
  RIVER_9: {
    detailed: 'river9.png',
    simplified: '#48929f'
  },
  RIVER_10: {
    detailed: 'river10.png',
    simplified: '#48929f'
  },
  RIVER_11: {
    detailed: 'river11.png',
    simplified: '#48929f'
  },
  RIVER_12: {
    detailed: 'river12.png',
    simplified: '#48929f'
  },
  BRIDGE_1: {
    detailed: 'bridge1.png',
    simplified: '#8d8071'
  },
  BRIDGE_2: {
    detailed: 'bridge2.png',
    simplified: '#8d8071'
  },
  BRIDGE_3: {
    detailed: 'bridge3.png',
    simplified: '#8d8071'
  },
  BRIDGE_4: {
    detailed: 'bridge4.png',
    simplified: '#8d8071'
  },
  BRIDGE_5: {
    detailed: 'bridge5.png',
    simplified: '#8d8071'
  },
  LAKE_1: {
    detailed: 'lake1.png',
    simplified: '#48929f'
  },
  SWAMP_1: {
    detailed: 'swamp1.png',
    simplified: '#57582b'
  },
  LANDS_CORE1: {
    detailed: 'landsCore1.png',
    simplified: '#051c82'
  }
}

export const ROTATION_DEG = [0, 60, 120, 180, 240, 300] as const
