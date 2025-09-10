import {Component, input} from '@angular/core';
import {Requirement} from '../data-models/Requirement';
import {Course} from '../data-models/Course';
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNestedDataSource, MatTreeNode,
  MatTreeNodeDef, MatTreeNodeOutlet, MatTreeNodePadding,
  MatTreeNodeToggle
} from '@angular/material/tree';
import {RequirementNode} from '../coursedegreegraph/RequirementNode';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-summary-node',
  imports: [
    MatTree,
    MatTreeNodeToggle,
    MatTreeNodeDef,
    MatIcon,
    MatIconButton,
    MatTreeNode,
    MatTreeNodePadding
  ],
  templateUrl: './summary-node.html',
  styleUrl: './summary-node.css'
})
export class SummaryNode {
  backingRequirements = input.required<Requirement[]>();

  requirementMap = input.required<Map<string, Requirement>>();

  courseMap = input.required<Map<string, Course>>();

  childrenAccessor = (node: Requirement) => node.childRequirements.map(id => this.requirementMap().get(id)!);

  hasChild = (_: number, node: Requirement) => node.childRequirements.length > 0

  MAX_REQUIREMENT_CHARS = 4

  nodeTitle(node :Requirement){
    if(node.name == null){
      return `Requirement - ${node.requirementId.substring(0, this.MAX_REQUIREMENT_CHARS)}... ${this.nodeDescription(node)}`
    }
    return node.name
  }

  nodeDescription(node :Requirement){
    return node.type == "AND" ? "Complete all" : "Complete at least one"
  }

  leafNodeDesc(node :Requirement){
    return node.leafCourses.map(id => this.courseMap().get(id)!.id).join(node.type == "AND" ? " and " : " or ")
  }
}
