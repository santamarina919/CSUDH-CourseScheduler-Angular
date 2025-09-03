import {EffectItem} from './EffectItem';


export type ActionType = 'ADDITION' | 'REMOVAL'

export abstract  class ScheduleEffect{

  id :string = crypto.randomUUID()

  abstract focus() :string

  abstract actionType() :ActionType

  abstract actionTaken() :string

  abstract effectItems() :EffectItem[]
}
