import { Table } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { QUESTION_URL } from "../../constants.js";
import axios from "axios";
import { toast } from "react-toastify";
import { confirm } from 'react-bootstrap-confirmation';

// Trims a question's description and render it in markdown
function descToTrimmedMd(desc) {
    // Limit max length displayed
    const trimmedQuestionBody = desc.length > 100 ? desc.substring(0, 100) + "..." : desc;
    return <ReactMarkdown linkTarget="_blank" rehypePlugins={[rehypeRaw]}>{trimmedQuestionBody}</ReactMarkdown>
}

function QuestionsTable(props) {
    async function handleDeleteQn(qn) {
        const isConfirmDelete = await confirm("Are you sure?", { title: `Delete: ${qn.title}`, okText: 'Confirm', okButtonStyle: 'danger', cancelButtonStyle: 'dark' });
        if (!isConfirmDelete) {
            return;
        }
        axios.delete(QUESTION_URL + qn._id)
        .then(res => {
            toast.success(`Successfully deleted ${qn.title}.`);
            props.fetchQuestions();
        })
        .catch(err => {
            if (err.response) {
                console.error(err.response);
            }
            toast.error(`Error deleting ${qn.title}, try again later.`);
        })
    }
    
    return <>
        <div className="manage-questions-table-container">
            <Table bordered hover className="manage-questions-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Difficulty</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.map(qn => {
                            return <tr key={qn._id}>
                                <td onClick={() => {props.setEditedQn(qn)}} className="non-action-cell id-cell">{qn._id}</td>
                                <td onClick={() => {props.setEditedQn(qn)}} className="non-action-cell">{qn.difficulty.charAt(0).toUpperCase() + qn.difficulty.substring(1)}</td>
                                <td onClick={() => {props.setEditedQn(qn)}} className="non-action-cell">{qn.title}</td>
                                <td onClick={() => {props.setEditedQn(qn)}} className="non-action-cell">{descToTrimmedMd(qn.description)}</td>
                                <td className="action-icon-container">
                                    <FontAwesomeIcon icon={faTrash} className="action-icon" onClick={() => handleDeleteQn(qn)}/>{' '}
                                    <FontAwesomeIcon icon={faPen} className="action-icon" onClick={() => {props.setEditedQn(qn)}}/>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
        </div>
    </>
}

export default QuestionsTable;