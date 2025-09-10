import {Requirement} from '../data-models/Requirement';
import {Course} from '../data-models/Course';
import {Prerequisite} from '../data-models/Prerequisite';
import {SerializedRequirement} from './SerializedRequirement';


export class SerializedGraph {

  requirements :SerializedRequirement[] = []

  constructor(
    public rootRequirements :Requirement[],
    private requirementMap : Map<string, Requirement>,
    private courseMap : Map<string, Course>,
    private prereqMap : Map<string, Prerequisite>,
    private completedRequirements :Map<string,number | undefined>,
    private fetchRootPrereq :(courseId :string) => Prerequisite | null,
  ) {
    this.rootRequirements.forEach(requirement => {
      this.requirements.push(new SerializedRequirement(requirement, requirementMap, courseMap,fetchRootPrereq,prereqMap))
    })
  }






}
