import { useState } from "react";
import { Button, Card, CardBody, Input, Label } from "reactstrap";
import { createComment } from "../../managers/commentManager";

export default function CommentForm({ loggedInUser, recipeId, getThisRecipesComments }) {
    const [text, setText] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        const commentToSendToAPI = {
            body: text,
            recipeId: recipeId,
            userProfileId: loggedInUser.id
        }

        createComment(commentToSendToAPI)
            .then(() => getThisRecipesComments(recipeId))
    };

    return (<>
        <Card>
            <CardBody>
                <Label for="commentText">
                    Comment your thoughts:
                </Label>
                <Input
                    id="commentText"
                    name="text"
                    type="textarea"
                    onChange={(e) => setText(e.target.value)}
                />
            </CardBody>
            <Button color="success" onClick={handleSubmit}>Submit</Button>
        </Card>
    </>)
};