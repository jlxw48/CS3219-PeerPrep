import { Table } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Trims a question's description and render it in markdown
function descToTrimmedMd(desc) {
    // Limit max length displayed
    const trimmedQuestionBody = desc.length > 100 ? desc.substring(0, 100) + "..." : desc;
    return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{trimmedQuestionBody}</ReactMarkdown>
}

function QuestionsTable(props) {
    return <>
        <div className="manage-questions-table-container">
            <Table bordered hover className="manage-questions-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Difficulty</th>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.map(qn => {
                            return <tr key={qn._id} onClick={() => {
                                props.setEditedQn(qn)}}>
                                <td>{qn._id}</td>
                                <td>{qn.difficulty.charAt(0).toUpperCase() + qn.difficulty.substring(1)}</td>
                                <td>{qn.title}</td>
                                <td>{descToTrimmedMd(qn.description)}</td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
        </div>
    </>
}

export default QuestionsTable;