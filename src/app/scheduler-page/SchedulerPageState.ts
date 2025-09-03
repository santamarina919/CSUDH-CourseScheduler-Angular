import {CourseDegreeGraph} from './CourseDegreeGraph';
import {FullPlanDetails} from './FullPlanDetails';
import {Course} from './Course';
import {Semester} from './Semester';
import {calcTerm} from '../utils/CalcTermFromSemester';
import {calcYear} from '../utils/CalcYearFromSemester';
import {ScheduleEffect} from './effects/ScheduleEffect';
import {PrerequisiteNode} from './PrerequisiteNode';
import {CourseRemoveBuilder, RemovedCourse} from './effects/CourseRemove';

export class Effect {
  constructor(public id :string) {
  }

}

export class SchedulerPageState {
  private planDetails :FullPlanDetails
  public courseDegreeGraph :CourseDegreeGraph
  public effects :ScheduleEffect[] = []

  constructor(
    courseDegreeGraph :CourseDegreeGraph,
    planDetails :FullPlanDetails
  ) {
    this.courseDegreeGraph = courseDegreeGraph
    this.planDetails = planDetails
  }

  fetchCourse(courseId :string){
    return this.courseDegreeGraph.fetchCourse(courseId)
  }

  //********FUNCTIONS RELATED TO PLANNED SEMESTERS********

  private largestEmptySemester :number = 0

  private DEFAULT_MAX = 2 * 4

  setLargestEmptySemester(semester :number){
    if(semester < 1){
      throw new Error('Semester must be greater than 0')
    }
    this.largestEmptySemester = semester
  }
  semesters() :Semester[] {

    const semesterMap = this.courseDegreeGraph.groupCoursesBySemeter()

    const largestPlannedSemester = Math.max(...Array.from(semesterMap.keys()),this.DEFAULT_MAX)

    const largestSemester = Math.max(this.largestEmptySemester,largestPlannedSemester)

    const semesters :Semester[] = []

    for(let semesterNum = 1; semesterNum <= largestSemester; semesterNum++){
      if(semesterMap.has(semesterNum)){
        const semesterCourses = semesterMap.get(semesterNum)!
        semesters.push(new Semester(semesterNum,semesterCourses,calcTerm(this.planDetails.term,semesterNum),calcYear(this.planDetails.year,semesterNum)))
      }
      else {
        semesters.push(new Semester(semesterNum,[],calcTerm(this.planDetails.term,semesterNum),calcYear(this.planDetails.year,semesterNum)))
      }
    }
    return semesters
  }

  rootsAsRequirements() {
    return this.courseDegreeGraph.roots().map(root => this.courseDegreeGraph.fetchRequirementBy(root)!)
  }

  availableCourses(semester :number) {
    return this.courseDegreeGraph.availableCourses(semester)
  }

  addCourseToSchedule(course :Course,semester :number) {
    console.info(`Adding ${course.name} to semester ${semester}`)
    const effect = this.courseDegreeGraph.addCourseToSchedule(course,semester)
    this.effects.push(effect.build())
  }

  removeCourseFromSchedule(courseId :string, removalEffect :CourseRemoveBuilder) {
    removalEffect.for(courseId)


    const onPrereqNode = (prereq :PrerequisiteNode) => {

      prereq.incomingPrereqs.forEach(prereqId => {
        const isCompleted = this.courseDegreeGraph.isPrereqCompelted(prereqId)
        if(isCompleted){
          removalEffect.uncompletesPrereq(prereqId)
        }
      })
    }


    const toBeRemoved = this.courseDegreeGraph.findAllDependentCourses(courseId,onPrereqNode)
    toBeRemoved.push(courseId)
    const courseToBeRemoved = toBeRemoved
      .map(courseId => this.fetchCourse(courseId)!)
      .filter(course => course.semesterPlanned != null)

    const removedCoursesEffect = courseToBeRemoved.map(course => [course.id,course.semesterPlanned!] as RemovedCourse)
    removalEffect.removes(removedCoursesEffect)


    return courseToBeRemoved
  }

  unplanCourse(courseId: string) {
    //TODO persist change
    this.fetchCourse(courseId)!.semesterPlanned = null
  }

}
