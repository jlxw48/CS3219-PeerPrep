const md = `# How to use PeerPrep 😀

<br/>

## Signing up 🙋🙋‍♀️

<br/>

Signing up is easy, simple visit the <a href="/register" target="_blank">register</a> page.

Enter your information and click \`Register\`. You will be redirected to the home page. You can now login by visiting the <a href="/login" target="_blank">login</a> page.


![image](https://user-images.githubusercontent.com/52824657/140275247-bbe10f69-35c5-4346-bb54-461096dd3667.png)


<hr/>

## Finding a match 👥

<br/>

After logging in, you can start finding a match for your interview practice by selecting a difficulty of questions that you want to practice.


![image](https://user-images.githubusercontent.com/52824657/140275518-d41450be-6a16-48aa-85bc-f746a7ab2b31.png)

<br/>

Here, we have selected the **Medium** difficulty. 

![image](https://user-images.githubusercontent.com/52824657/140269155-bf6a8a59-2490-4def-aa2d-b3b3620fd3cf.png)

Press \`Find Match\` to find an interview partner that also wants to practice a medium difficulty question.

<div className="alert alert-secondary">If another user also wants to practice a medium difficulty question, a match will be made between you and the user.</div>

<hr/>

## During an interview 🖥
There are three main components of the interview page.

#### The question
The question that you see will be the same as the one that your partner sees.

#### The code editor
The code editor allows you and your interview partner to collaborate on the question. You will be able to see what your partner types in real time! We currently only support **Python**, but we plan to add support for other programming languages in the future 😄. 

#### The chat
The chat window can be expanded and collapsed with a click of a button. It allows you to conveniently communicate your ideas with your partner.

![image](https://user-images.githubusercontent.com/52824657/140269900-2906e76d-96cc-4f6f-9c26-fc6f65a0619d.png)

<div className="alert alert-info">
    <b>Note</b>: Due to our limited compute resources as a start up, we have a concurrent interview limit of 5 (10 users can interview at any time.
    To ensure that all users have an equal chance to use our awesome application, we enforce a 1 hour time limit for all interviews. Your interview will also be ended if you remain inactive for more than 10 minutes.
</div>
 
<hr/>

## Ending and resuming an interview ⛔️
Click the \`End Interview\` button if you wish to end the interview. Your partner will be notified when you end your interview but he will be able to continue practicing.

![image](https://user-images.githubusercontent.com/52824657/140270574-fe8eb2eb-3066-44bb-b7c6-afb486eeebf2.png)

If you visit another page in our website while in an interview, you will be able to resume the interview by clicking the \`Resume Interview\` button.

![image](https://user-images.githubusercontent.com/52824657/140270814-9f799af2-1a9f-40b9-98a2-aa9cd072c048.png)

<div className="alert alert-info"><b>Note: </b>If you are in an interview and you experience a network issue or you refresh the page, you will be safely brought back to the interview page 👍.</div>

<br/>

[Back to home](/)

<br/>
<br/>
`

export default md;