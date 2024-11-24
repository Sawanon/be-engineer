import {
  getCourseById,
} from "@/lib/actions/course.actions";
import Buttons from "./Buttons";
import ManageCourse from "./ManageCourse";
import AddCourse from "./AddCourse";

const ManageCourseWrapper = async ({
  id,
}:{
  id: string
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
      />
    </div>
  )
}

export default ManageCourseWrapper