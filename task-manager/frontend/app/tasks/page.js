import NewTaskForm from "../components/NewTaskCreator";
import Tasks from "../components/Tasks";
import DeleteTAskForm from "../components/DeleteTask";
import classes from "./page.modules.css"


export default function Home() {
  return (
    <div className={classes.main}>
      <Tasks />
      <hr className={classes.divider}/>
      <NewTaskForm />
      <hr className={classes.divider}/>
      <DeleteTAskForm/>
    </div>
  );
}
