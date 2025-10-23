# CourseSchedulerAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## What is the project? 
This project is the front end of a full stack web application that allows 
students to plan how the courses they need to obtain a degree from California State 
Dominguez Hills. This project was built using Angular 2. 


## Features

### Valid Course Planning

Valid course is a system that ensures any plan the user creates through this application
is valid. The application will only present choices to the user that do not violate
the requirements set out by the university.

### Safe Course Add/Remove
Safe course add/remove allows the user to add a course or remove a course, and the application
will handle any side effects that may arise from the actions. An example of this is when a user removes a course
from their plan, but the course is required by another course. In other words, a user wants to remove C1 from semester S, but
C2 planned in semester Y requires C1 be completed during S. The application will ensure
that any courses that are removed will remove all courses like C2. This action is "safe" in the sense that 
the user will not be able to take their plan into an invalid state. The opposite occures with adding a course, where the 
application will ensure that all courses that depened on the added course will have their state updated. 


### Effects
Every action the user takes has some effect on an object in the application. The effects 
culminate into a course being available for a semester or being added to the plan. Effects documents these events along side the 
action that was taken. This allows users to understand how the application reached the current state it 
is in.

### Undo Effect
Given that the user's actions take the application into some state. The user may realize that they 
want to take the application back to a state before some action was taken. The undo feature allows users to 
take the application back to a previous state before some aciton was taken. The action in question is a effect listed by the application. 
Undoing an effect will take the application to the state before the effect took place. 

### Degree Mapping
The application represents a degree the university offers as a graph. This feature transforms the graph representation
into a format that is easier for the user to understand. It is nested drop down menus that display what each requirement asks the user complete
 to satisfy it. 

### Summary
The summary feature overlays what the user has already planned on top of the degree mapping feature. 
