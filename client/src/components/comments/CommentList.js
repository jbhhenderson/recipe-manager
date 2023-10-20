import { useEffect, useState } from "react"
import { getRecipeComments } from "../../managers/commentManager";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import CommentForm from "./CommentForm";

export default function CommentList ({loggedInUser, recipeId, comments, getThisRecipesComments}) {
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
                    ? <>
                        <Button color="danger">Delete Comment</Button>
                        <Button color="primary">Edit Comment</Button>
                    </>
                    : <></>
                }
            </Card>
        })
    }
    </>)
};