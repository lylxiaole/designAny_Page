import { layoutEventBehaviors, behavior } from '../../../02common/behavior'

export enum behaviorPageType {
  binding = 'behaviorEventBinding',
  list = 'behaviorListInPage',
  detail = 'behaviorDeatilSetting',
}

export class behaviorListInParam {
  selectedEventName: string
  allBehaviors: behavior[]
  eventBehavior: layoutEventBehaviors
}

export class behaviorListData {
  prePage: behaviorPageType
  selectedEventName: string
  eventBehavior: layoutEventBehaviors
}

export class behaviorDetailData {
  prePage: behaviorPageType
  selectedEventName: string
  selectedBehavior: behavior
  listTempAllBehaviors: behavior[]
  listTempEventBehavior: layoutEventBehaviors
}

export class behaviorDetailInParam {
  selectedBehavior: behavior
}

export class behaviorBindingInParam {
  selectedEventName: string
}
