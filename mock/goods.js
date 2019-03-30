import Mock from 'mockjs'

let categories = Mock.mock({
  'categories|30': [{ name: '@ctitle' }]
})

let goods = Mock.mock({
  'goods|30': [{
    id: '@id',
    'name|1': ['香蕉', '苹果', '西瓜', '菠萝', '椰子', '柠檬', '西柚', '橙子', '草莓', '芒果'],
    'category|1': categories.categories,
    stock: '@natural',
    'status|1': ['下架', '销售中'],
    'pictures|5': [{ name: '@ctitle', url: '@image' }],
    'description': '@cparagraph',
    price: Mock.Random.natural(1,1000),
    'options|3': [{
      key: '@ctitle',
      values: ['@ctitle', '@ctitle']
    }]
  }]
})

export default {
  goods: goods,
  getGoods: () => {
    return {
      code: 20000,
      data: goods
    }
  },
  getGood: () => {
    let good = Mock.mock({
      'good|1': goods.goods
    })
    return {
      code: 20000,
      data: good
    }
  },
  getCategories: () => {
    return {
      code: 20000,
      data: categories
    }
  },
  addGood: () => {
    let good = Mock.mock({
      'good|1': goods.goods
    })
    return {
      code: 20000,
      data: good
    }
  },
  changeStatus: () => {
    return {
      code: 20000,
      message: 'success',
      data: {
        goodId: 123,
        status: '销售中'
      }
    }
  },
  editGood: () => {
    return {
      code: 20000,
      data: Mock.mock({
        'good|1': goods.goods
      })
    }
  }
}

export { goods }
