import { async } from 'q'
import { func, string } from 'prop-types'

// **********data from service**********************************
export interface rtnData {
  /** 工序 */
  workcells: rtnDataDetail[]
  hejitotals: hejiTotal

  fragmentrate: any
}
export interface rtnDataDetail {
  /** 工序 */
  workcell: string
  /**备注 */
  remark: string
  /**数据验证 */
  verification: string
  /** 碎片率 */
  fragmentrate: string
  /**线数据 */
  linedets: linedet[]
  /**合计数据 */
  hejidets: hejidet
}
export interface linedet {
  /**线别 */
  line: string
  fragmentrate: string
  /**数据 */
  dets: det[]
}
export interface hejidet {
  line: string
  /**数据 */
  dets: det
}

export interface hejiTotal {
  curintqty: number
  curqty: number
  curtotalqty: number
  fragmentqty: number
  fragmentrate: string
  name: string
  preqty: number
  remark: string
  returnqty: number
  srcapqty: number
}

export interface det {
  /**批次名称 */
  batchname: string
  /**批次编号 */
  batchno: string
  /*上班结存 */
  preqty: number
  /**本版流入 */
  curintqty: number
  /**本版产量 */
  curqty: number
  /**本版结存 */
  curtotalqty: number
  /**反工数量 */
  returnqty: number
  /**碎片数量 */
  fragmentqty: number
  /** 报废数量 */
  srcapqty: number
  /** 碎片率 */
  fragmentrate: string
}
// **********data to table**********************************
export interface IGridProductDetail {
  key: any
  /*** '工序' */
  process: string
  /**线别 */
  line: string
  /**批次号 */
  batchNo: string
  /**上班结存 */
  preqty: number
  /**本班流入 */
  curintqty: number
  /**本班产量 */
  curqty: number
  /**本班结存 */
  curtotalqty: number
  /**反工数量 */
  returnqty: number
  /**碎片数量 */
  fragmentqty: number
  /** 报废数量 */
  srcapqty: number
  /**碎片率 */
  fragmentrate: string
  /** */
  remark: string
}

export interface IJiangliaoUseDetail {
  key: any
  level: number
  mainClass: string //主分类
  secondClass: string //次分类
  /*小库发料 1 */
  xiaokufaliao_one: any
  /*上班结存 1 */
  preqty_one: number
  /**本版消耗 1 */
  benbanxiaohao_one: number
  /**本版结存 1*/
  curtotalqty_one: number

  /*小库发料 2 */
  xiaokufaliao_two: any
  /*上班结存 2 */
  preqty_two: number
  /**本版消耗 2 */
  benbanxiaohao_two: number
  /**本版结存 2 */
  curtotalqty_two: number

  /*小库发料 3*/
  xiaokufaliao_three: any
  /*上班结存 3 */
  preqty_three: number
  /**本版消耗 3*/
  benbanxiaohao_three: number
  /**本版结存 3*/
  curtotalqty_three: number

  /*小库发料 4*/
  xiaokufaliao_four: any
  /*上班结存 4 */
  preqty_four: number
  /**本版消耗 4*/
  benbanxiaohao_four: number
  /**本版结存 4*/
  curtotalqty_four: number

  /*小库发料 5*/
  xiaokufaliao_five: any
  /*上班结存 5 */
  preqty_five: number
  /**本版消耗 5*/
  benbanxiaohao_five: number
  /**本版结存 5*/
  curtotalqty_five: number
}

// **********data adapter**********************************
export function toTableData_GridProductDetail(rtnDatas: rtnData): IGridProductDetail[] {
  let res: IGridProductDetail[] = []
  if (!rtnDatas || !rtnDatas.workcells) {
    return res
  }
  // window.console.log('toTableData_GridProductDetail:', rtnDatas)
  let gindex = 1
  for (let index = 0; index < rtnDatas.workcells.length; index++) {
    const rtnData = rtnDatas.workcells[index]

    rtnData.linedets.map((line) => {
      line.dets.map((det, jindex) => {
        res.push({
          key: gindex++,
          process: rtnData.workcell,
          /**线别 */
          line: line.line,
          /**批次号 */
          batchNo: det.batchno,
          /**上班结存 */
          preqty: det.preqty,
          /**本班流入 */
          curintqty: det.curintqty,
          /**本班产量 */
          curqty: det.curqty,
          /**本班结存 */
          curtotalqty: det.curtotalqty,
          /**反工数量 */
          returnqty: det.returnqty,
          /**碎片数量 */
          fragmentqty: det.fragmentqty,
          /** 报废数量 */
          srcapqty: det.srcapqty,
          /**碎片率 */
          fragmentrate: line.fragmentrate,
          /** */
          remark: rtnData.remark
        })
      })
    })
    res.push({
      key: gindex++,
      process: rtnData.workcell,
      /**线别 */
      line: rtnData.hejidets.line,
      /**批次号 */
      batchNo: rtnData.hejidets.dets.batchno,
      /**上班结存 */
      preqty: rtnData.hejidets.dets.preqty,
      /**本班流入 */
      curintqty: rtnData.hejidets.dets.curintqty,
      /**本班产量 */
      curqty: rtnData.hejidets.dets.curqty,
      /**本班结存 */
      curtotalqty: rtnData.hejidets.dets.curtotalqty,
      /**反工数量 */
      returnqty: rtnData.hejidets.dets.returnqty,
      /**碎片数量 */
      fragmentqty: rtnData.hejidets.dets.fragmentqty,
      /** 报废数量 */
      srcapqty: rtnData.hejidets.dets.srcapqty,
      /**碎片率 */
      fragmentrate: rtnData.hejidets.dets.fragmentrate,
      /** */
      remark: rtnData.remark
    })
  }
  res.push({
    key: gindex++,
    process: '合计',
    /**线别 */
    line: '合计',
    /**批次号 */
    batchNo: '合计',
    /**上班结存 */
    preqty: rtnDatas.hejitotals.preqty,
    /**本班流入 */
    curintqty: rtnDatas.hejitotals.curintqty,
    /**本班产量 */
    curqty: rtnDatas.hejitotals.curqty,
    /**本班结存 */
    curtotalqty: rtnDatas.hejitotals.curtotalqty,
    /**反工数量 */
    returnqty: rtnDatas.hejitotals.returnqty,
    /**碎片数量 */
    fragmentqty: rtnDatas.hejitotals.fragmentqty,
    /** 报废数量 */
    srcapqty: rtnDatas.hejitotals.srcapqty,
    /**碎片率 */
    fragmentrate: rtnDatas.hejitotals.fragmentrate,
    /** */
    remark: rtnDatas.hejitotals.remark
  })
  res.push({
    key: gindex++,
    process: '合计1xxx',
    /**线别 */
    line: '合计1xxx',
    /**批次号 */
    batchNo: '合计1xxx',
    /**上班结存 */
    preqty: rtnDatas.hejitotals.preqty,
    /**本班流入 */
    curintqty: rtnDatas.hejitotals.curintqty,
    /**本班产量 */
    curqty: rtnDatas.hejitotals.curqty,
    /**本班结存 */
    curtotalqty: rtnDatas.hejitotals.curtotalqty,
    /**反工数量 */
    returnqty: rtnDatas.hejitotals.returnqty,
    /**碎片数量 */
    fragmentqty: rtnDatas.hejitotals.fragmentqty,
    /** 报废数量 */
    srcapqty: rtnDatas.hejitotals.srcapqty,
    /**碎片率 */
    fragmentrate: ('总碎片数:' + rtnDatas.hejitotals.fragmentqty) as any,
    /** */
    remark: ''
  })
  // window.console.log('toTableData_GridProductDetail:', res)
  return res
}

export function toTableData_GridProductDetail1(rtnDatas: rtnData): IGridProductDetail[] {
  let res: IGridProductDetail[] = []
  if (!rtnDatas || !rtnDatas.workcells) {
    return res
  }

  let gindex = 1
  for (let index = 0; index < rtnDatas.workcells.length; index++) {
    const rtnData = rtnDatas.workcells[index]
    res.push({
      key: gindex++,
      process: rtnData.workcell,
      /**线别 */
      line: rtnData.hejidets.line,
      /**批次号 */
      batchNo: rtnData.hejidets.dets.batchno,
      /**上班结存 */
      preqty: rtnData.hejidets.dets.preqty,
      /**本班流入 */
      curintqty: rtnData.hejidets.dets.curintqty,
      /**本班产量 */
      curqty: rtnData.hejidets.dets.curqty,
      /**本班结存 */
      curtotalqty: rtnData.hejidets.dets.curtotalqty,
      /**反工数量 */
      returnqty: rtnData.hejidets.dets.returnqty,
      /**碎片数量 */
      fragmentqty: rtnData.hejidets.dets.fragmentqty,
      /** 报废数量 */
      srcapqty: rtnData.hejidets.dets.srcapqty,
      /**碎片率 */
      fragmentrate: rtnData.hejidets.dets.fragmentrate,
      /** */
      remark: rtnData.remark
    })
  }
  // window.console.log('toTableData_GridProductDetail:', res)
  return res
}

export function toTableData_GridProductDetail2(rtnDatas: rtnData): IGridProductDetail[] {
  let res: IGridProductDetail[] = []
  if (!rtnDatas || !rtnDatas.workcells) {
    return res
  }

  res = toTableData_GridProductDetail1(rtnDatas)
  window.console.log('toTableData_GridProductDetail2:', rtnDatas)
  window.console.log('toTableData_GridProductDetail2:', res)
  let findindex = res.findIndex((o) => o.process === '未清洗返工结存' || !o.process)
  if (findindex > -1) {
    res.splice(findindex, 1)
  }

  let gindex = res.length + 1

  res.push({
    key: 'toTableData_GridProductDetail2' + gindex++,
    process: '总碎片',
    /**线别 */
    line: '合计',
    /**批次号 */
    batchNo: '合计',
    /**上班结存 */
    preqty: rtnDatas.hejitotals.preqty,
    /**本班流入 */
    curintqty: rtnDatas.hejitotals.curintqty,
    /**本班产量 */
    curqty: rtnDatas.hejitotals.fragmentqty,
    /**本班结存 */
    curtotalqty: rtnDatas.hejitotals.curtotalqty,
    /**反工数量 */
    returnqty: rtnDatas.hejitotals.returnqty,
    /**碎片数量 */
    fragmentqty: '总碎片率' as any,
    /** 报废数量 */
    srcapqty: rtnDatas.hejitotals.srcapqty,
    /**碎片率 */
    fragmentrate: rtnDatas.fragmentrate,
    /** */
    remark: rtnDatas.hejitotals.remark
  })

  let findfenxuan = res.find((o) => o.process === '分选')
  let findsuipian = res.find((o) => o.process === '总碎片')
  res.push({
    key: 'toTableData_GridProductDetail2' + gindex++,
    process: '总消耗',
    /**线别 */
    line: '合计1xxx',
    /**批次号 */
    batchNo: '合计1xxx',
    /**上班结存 */
    preqty: rtnDatas.hejitotals.preqty,
    /**本班流入 */
    curintqty: rtnDatas.hejitotals.curintqty,
    /**本班产量 */
    curqty: findfenxuan ? findfenxuan.curqty + findsuipian.curqty : 0 + findsuipian.curqty,
    /**本班结存 */
    curtotalqty: rtnDatas.hejitotals.curtotalqty,
    /**反工数量 */
    returnqty: rtnDatas.hejitotals.returnqty,
    /**碎片数量 */
    fragmentqty: rtnDatas.hejitotals.fragmentqty,
    /** 报废数量 */
    srcapqty: rtnDatas.hejitotals.srcapqty,
    /**碎片率 */
    fragmentrate: ('总碎片数:' + rtnDatas.hejitotals.fragmentqty) as any,
    /** */
    remark: ''
  })
  return res
}

export function toTableData_JiangliaoUseDetail(serverdata: any[]): IJiangliaoUseDetail[] {
  let res: IJiangliaoUseDetail[] = []
  if (!serverdata) {
    return res
  }
  /***********统计行************ */
  for (let index = 0; index < serverdata.length; index++) {
    const data = serverdata[index]
    for (let jndex = 0; jndex < data.col.length; jndex++) {
      const col = data.col[jndex]
      for (let kndex = 0; kndex < col.dets.length; kndex++) {
        const det = col.dets[kndex]
        let key = col.type + det.itemName

        if (data.level <= 5) {
          key = '浆料' + key
        } else {
          key = '网版' + key
        }

        if (!res.find((o) => o.key === key)) {
          let newitem: IJiangliaoUseDetail = {
            key: key
          } as any
          res.push(newitem)
        }
      }
    }

    if (data.level === 5) {
      let newitem: IJiangliaoUseDetail = {
        key: '浆料合计'
      } as any
      res.push(newitem)

      let newitem2: IJiangliaoUseDetail = {
        key: '网版头',
        mainClass: '一道网版',
        xiaokufaliao_one: '一道网版',
        xiaokufaliao_two: '二道网版',
        xiaokufaliao_three: '三道网版',
        xiaokufaliao_four: '四道网版',
        xiaokufaliao_five: '五道网版'
      } as any

      res.push(newitem2)

      let newitem3: IJiangliaoUseDetail = {
        key: '网版头2',
        mainClass: '网版分类',
        /*小库发料 1 */
        xiaokufaliao_one: '小库发料(万块)',
        /*上班结存 1 */
        preqty_one: '上班结存(万块)',
        /**本版消耗 1 */
        benbanxiaohao_one: '本版消耗(万块)',
        /**本版结存 1*/
        curtotalqty_one: '本版结存(万块)',
        /*小库发料 1 */
        xiaokufaliao_two: '小库发料(万块)',
        /*上班结存 1 */
        preqty_two: '上班结存(万块)',
        /**本版消耗 1 */
        benbanxiaohao_two: '本版消耗(万块)',
        /**本版结存 1*/
        curtotalqty_two: '本版结存(万块)',
        /*小库发料 1 */
        xiaokufaliao_three: '小库发料(万块)',
        /*上班结存 1 */
        preqty_three: '上班结存(万块)',
        /**本版消耗 1 */
        benbanxiaohao_three: '本版消耗(万块)',
        /**本版结存 1*/
        curtotalqty_three: '本版结存(万块)',
        /*小库发料 1 */
        xiaokufaliao_four: '小库发料(万块)',
        /*上班结存 1 */
        preqty_four: '上班结存(万块)',
        /**本版消耗 1 */
        benbanxiaohao_four: '本版消耗(万块)',
        /**本版结存 1*/
        curtotalqty_four: '本版结存(万块)',
        /*小库发料 1 */
        xiaokufaliao_five: '小库发料(万块)',
        /*上班结存 1 */
        preqty_five: '上班结存(万块)',
        /**本版消耗 1 */
        benbanxiaohao_five: '本版消耗(万块)',
        /**本版结存 1*/
        curtotalqty_five: '本版结存(万块)'
      } as any

      res.push(newitem3)
    }
    if (data.level === 6) {
      let newitem: IJiangliaoUseDetail = {
        key: '网版合计'
      } as any
      res.push(newitem)
    }
  }
  /***********填充行数据************ */
  for (let index = 0; index < serverdata.length; index++) {
    const data = serverdata[index]
    for (let jndex = 0; jndex < data.col.length; jndex++) {
      const col = data.col[jndex]
      for (let kndex = 0; kndex < col.dets.length; kndex++) {
        const det = col.dets[kndex]
        let key = col.type + det.itemName
        if (data.level <= 5) {
          key = '浆料' + key
        } else {
          key = '网版' + key
        }

        filldata(res, key, data.level, det, col.type, det.itemName)
      }
    }

    let key = '浆料合计'
    if (data.level > 5) {
      key = '网版合计'
    }
    filldata(res, key, data.level, data.heji)
  }
  return res
}

function filldata(allData: IJiangliaoUseDetail[], key: string, level: number, data: any, type?: string, itemName?: string) {
  let findd = allData.find((o) => o.key === key)
  if (!findd) {
    return
  }
  if (findd.key.indexOf('合计') > -1) {
    findd.mainClass = '合计'
    findd.secondClass = '合计'
  } else {
    findd.mainClass = type
    findd.secondClass = itemName
  }
  findd.level = level
  if (level % 5 === 1) {
    findd.xiaokufaliao_one = data.input
    findd.preqty_one = data.lastsettlement
    findd.benbanxiaohao_one = data.consumption
    findd.curtotalqty_one = data.settlement
  } else if (level % 5 === 2) {
    findd.xiaokufaliao_two = data.input
    findd.preqty_two = data.lastsettlement
    findd.benbanxiaohao_two = data.consumption
    findd.curtotalqty_two = data.settlement
  } else if (level % 5 === 3) {
    findd.xiaokufaliao_three = data.input
    findd.preqty_three = data.lastsettlement
    findd.benbanxiaohao_three = data.consumption
    findd.curtotalqty_three = data.settlement
  } else if (level % 5 === 4) {
    findd.xiaokufaliao_four = data.input
    findd.preqty_four = data.lastsettlement
    findd.benbanxiaohao_four = data.consumption
    findd.curtotalqty_four = data.settlement
  } else if (level % 5 === 0) {
    findd.xiaokufaliao_five = data.input
    findd.preqty_five = data.lastsettlement
    findd.benbanxiaohao_five = data.consumption
    findd.curtotalqty_five = data.settlement
  }
}

export function toTableData_JiangliaoWangbanSaved(serverdata: any): IJiangliaoUseDetail[] {
  if (!serverdata) {
    return []
  }
  // window.console.log('toTableData_JiangliaoWangbanSaved:', serverdata)
  return serverdata
}
export function toTableData_JiangliaoWangbanUsed(serverdata: any): IJiangliaoUseDetail[] {
  if (!serverdata) {
    return []
  }
  // window.console.log('toTableData_JiangliaoWangbanUsed:', serverdata)
  return serverdata
}
