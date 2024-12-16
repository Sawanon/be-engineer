import {
  getCourseById,
} from "@/lib/actions/course.actions";
import ManageCourse from "./ManageCourse";
import AddCourse from "./AddCourse";

const ManageCourseWrapper = async ({
  id,
  mode,
}:{
  id: string,
  mode: string,
}) => {
  if(!id){
    return <></>
  }
  if(id === "add"){
    return <AddCourse />
  }
  const selectedCourse = await getCourseById(parseInt(id))
  return (
    <div>
      <ManageCourse
        isOpenDrawer={true}
        selectedCourse={selectedCourse}
        mode={mode}
      />
    </div>
  )
}

export default ManageCourseWrapper