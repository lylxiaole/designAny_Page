import { async } from 'q'
import { func, string } from 'prop-types'

// **********data from service**********************************
export interface rtnData {
  /** 工序 */
  workcells: rtnDataDetail[]
  hejitotals: hejiTotal
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
  mainClass: string //主分类
  secondClass: string //次分类
  /*小库发料 1 */
  xiaokufaliao_one: number
  /*上班结存 1 */
  preqty_one: number
  /**本版消耗 1 */
  benbanxiaohao_one: number
  /**本版结存 1*/
  curtotalqty_one: number

  /*小库发料 2 */
  xiaokufaliao_two: number
  /*上班结存 2 */
  preqty_two: number
  /**本版消耗 2 */
  benbanxiaohao_two: number
  /**本版结存 2 */
  curtotalqty_two: number

  /*小库发料 3*/
  xiaokufaliao_three: number
  /*上班结存 3 */
  preqty_three: number
  /**本版消耗 3*/
  benbanxiaohao_three: number
  /**本版结存 3*/
  curtotalqty_three: number

  /*小库发料 4*/
  xiaokufaliao_four: number
  /*上班结存 4 */
  preqty_three_four: number
  /**本版消耗 4*/
  benbanxiaohao_four: number
  /**本版结存 4*/
  curtotalqty_four: number

  /*小库发料 5*/
  xiaokufaliao_five: number
  /*上班结存 5 */
  preqty_three_five: number
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
  window.console.log('toTableData_GridProductDetail:', rtnDatas)
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
  let findindex = res.findIndex((o) => o.process === '返工投入' || !o.process)
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
    fragmentrate: rtnDatas.hejitotals.fragmentrate,
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

export function toTableData_JiangliaoUseDetail(serverdata: any): IJiangliaoUseDetail[] {
  window.console.log('toTableData_JiangliaoUseDetail:', serverdata)
  return []
}

export function toTableData_JiangliaoWangbanSaved(serverdata: any): IJiangliaoUseDetail[] {
  return []
}
export function toTableData_JiangliaoWangbanUsed(serverdata: any): IJiangliaoUseDetail[] {
  return []
}

// export function toTableData_JiangliaoUseDetail(serverdata: any): IJiangliaoUseDetail[] {
//   return []
// }
