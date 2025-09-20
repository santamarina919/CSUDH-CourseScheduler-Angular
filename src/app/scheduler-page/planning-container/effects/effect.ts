

export abstract class Effect {

  private courseStates = []

  private prerequisiteStates = []

  private degreeRequirementStates = []

  private effectId  = crypto.randomUUID()

  protected constructor() {}

  public get id() {
    return this.effectId;
  }

  abstract verbClass() :string;

  abstract verb() :string;

  abstract subject() :string;

}
