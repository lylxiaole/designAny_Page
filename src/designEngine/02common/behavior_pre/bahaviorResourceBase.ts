import common from '../commonMethod'

import PageBase from '../../05designerLayouts/PageBase'
import ComponentBase from '../../04designerComponents/ComponentBase'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { behavior, variable, action, actionDetail } from '../behavior/behaviorTypes'
import {
  objectBase,
  objectType,
  resourceType,
  resourceSearchType,
  object_Method,
  object_Variable,
  allCuteSigns,
  allFilterSigns,
  resourceSearchAttr,
} from '../behavior/01_actionCommon'
import factory from '../behavior/03_actionFactory'
import { CurrentContext, CurrentApis, pagenNodeType } from '../../01designerContext'
import { Property } from '../commonClasses/LayoutProperty'
import { layoutMethod, param, paramType } from '../commonClasses/layoutEvent'
import paramInfo from '../commonClasses/pageInParamInfo'

export default class bahaviorResourceBase {
  currentPage: PageBase = null
  actionFctory: factory = null
  currentBehavior: behavior = null

  totalPageNumber: number = 1
  pageIndex: number = 0
  pageSize: number = 20
}
