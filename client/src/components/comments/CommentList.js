import { useEffect, useState } from "react"
import { deleteComment, editComment, getRecipeComments } from "../../managers/commentManager";
import { Button, Card, CardBody, CardTitle, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import CommentForm from "./CommentForm";

export default function CommentList ({loggedInUser, recipeId, comments, getThisRecipesComments}) {
    const [modal, setModal] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState({})

    const handleDelete = (e, commentId) => {
        e.preventDefault();

        deleteComment(commentId)
            .then(() => getThisRecipesComments(recipeId))
    };

    const toggle = () => setModal(!modal);

    const handleCommentChange = (target) => {
        const clone = structuredClone(commentToEdit);
        clone[target.name] = target.value;
        setCommentToEdit(clone);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        editComment(commentToEdit)
            .then(() => getThisRecipesComments())
    }

    return (<>
    <CommentForm loggedInUser={loggedInUser} recipeId={recipeId} getThisRecipesComments={getThisRecipesComments}/>
    {
        comments.map((c) => {
            return <Card>
                <CardTitle>Comment By: {c.userProfile.firstName} {c.userProfile.lastName}</CardTitle>
                <CardBody>
                    {c.body}
                </CardBody>
                {
                    c.userProfileId === loggedInUser.id 
                    ? <div style={{width: "30%"}}>
                        <Button color="danger" onClick={(e) => handleDelete(e, c.id)}>Delete Comment</Button>
                        <Button color="primary" onClick={() => {
                            toggle() 
                            setCommentToEdit(c)
                        }}>Edit Comment</Button>
                    </div>
                    : <></>
                }
            </Card>
        })
    }
    <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Comment By: {commentToEdit?.userProfile?.firstName} {commentToEdit?.userProfile?.lastName}</ModalHeader>
        <ModalBody>
            <Input
                value={commentToEdit.body}
                name="body"
                type="textarea"
                onChange={(e) => handleCommentChange(e.target)}
            />
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={(e) => {
                toggle()
                handleEditSubmit(e)
            }}>
                Submit
            </Button>
        </ModalFooter>
    </Modal>
    </>)
};