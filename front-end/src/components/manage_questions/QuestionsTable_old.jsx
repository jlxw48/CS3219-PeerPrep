import { useEffect } from "react";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
const $ = require('jquery');
$.DataTable = require('datatables.net');
require('datatables.net-responsive-bs5');
require("datatables.net-bs5");
require('datatables.net-responsive');
const { Modal } = require('bootstrap');
window.bootstrap = { Modal }

function manipulateQuestion(qn)  {
    // Limit max length displayed
    let desc = qn.description;
    const trimmedQuestionBody = desc.length > 300 ? desc.substring(0, 300) + "..." : desc;
    qn.description = <ReactMarkdown rehypePlugins={[rehypeRaw]}>{trimmedQuestionBody}</ReactMarkdown>
}

function QuestionsTable(props) {
    console.log(props.data);
    const columns = [
        {
            title: "Id",
            data: "_id",
            width: 20
        },
        {
            title: 'Difficulty',
            data: 'difficulty',
            width: 20
        },
        {
            title: 'Title',
            data: 'title',
            width: 20
        },
        {
            title: "Description",
            data: 'description',
            width: 240
        }
    ]

    useEffect(() => {
        console.log("constructing table");
        console.log(props.data);

        // Setup table upon component load
        $(".manage-questions-table").DataTable({
            columns,
            ordering: false,
            data: props.data,
        });

        // Teardown table upon component tear down
        return () => {
            console.log("destroying table");
            $(".manage-questions-table").DataTable().destroy(true);
        }

    }, [props])
    return(
    <div>
        <table className="manage-questions-table table-striped table-bordered table dt-responsive nowrap" style={{ "width": "100%" }}>       
            {/* {
                props.data.map(qn => {
                    return <tr>
                        <td>{qn.title}</td>
                        <td>{qn.difficulty}</td>
                        <td>{qn.description}</td>
                    </tr>
                })
            } */}
        </table>
    </div>);

}



export default QuestionsTable;