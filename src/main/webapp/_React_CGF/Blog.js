"use strict";

function Blog() {
    return (
        <div className="blog">
            <h2>Blog</h2>
            <h3>Server Page</h3>
            <p>If you would like to see my "Hello World" API open up in a new tab,
                <a href="hello" target="_blank">click here</a> to see my published server side page.
            </p>
            <h3>My Database Table</h3>
            <p>My proposed database table name is car. Users who are trying to sell the car will input their car information and this table will contain those information. Following are the field name and datatype of this table.</p>
            <table>
                <tr>
                    <th>Attribute</th>
                    <th>DataType</th>
                </tr>
                <tr>
                    <td>car_id</td>
                    <td>INT</td>
                </tr>
                <tr>
                    <td>car_picture</td>
                    <td>VARCHAR</td>
                </tr>
                <tr>
                    <td>car_year</td>
                    <td>INT</td>
                </tr>
                <tr>
                    <td>make</td>
                    <td>VARCHAR</td>
                </tr>
                <tr>
                    <td>model</td>
                    <td>VARCHAR</td>
                </tr>
                <tr>
                    <td>price</td>
                    <td>DECIMAL</td>
                </tr>
                <tr>
                    <td>car_name</td>
                    <td>VARCHAR</td>
                </tr>
                <tr>
                    <td>mileage</td>
                    <td>VARCHAR</td>
                </tr>
                <tr>
                    <td>web_user_id(foreign key)</td>
                    <td>INT</td>
                </tr>
            </table>
            <h3>My Database Experience</h3>
            <p>I was not that familiar with database, but the lab activity2 really helped me understand database. Also, I easily figured out that the third database table for my website would be car_info table, because users who are willing to sell their car will be putting their car information. </p>
            <h3>My Web development Experience</h3>
            <p>I learned a lot about html and css so far. Videos from <a href="https://cis-linux2.temple.edu/~sallyk/#/home"> https://cis-linux2.temple.edu/~sallyk/#/home </a> and "Try it yourself" section from W3schools.com really helped me understand complex concepts.</p>
            <h3>HW1(Home page)</h3>
            <p>I was a bit familiar with html from before, and as a result found it a bit easy. However, I struggled to get used to with css, and database.</p>
            <h3>HW2(Database)</h3>
            <p>This database homework Experience went well. I added car table as my other table, and added foreign key from web_user table into it. I also easily ran all the select statements.
                Here is the link to the pdf of my database homework. Click <a target="_blank" href="docs/ahmed_database.pdf">here</a> </p>
            <h3>HW3(SPA)</h3>
            <p>Since, I was new to Javascript and react; I struggled to understand the basics of it, but the lab activity and homework really helped me understanding complex concepts. I better understood about using react routing from the homework3.</p>
            <h3>HW4(JS Components)</h3>
            <p>I got to spent more time in this homework compared to others and it helped me understand concpets like JS templating and using destructured parameter object a lot better. I also used onblur() event handling and also did some work in the css file for this homework. </p>
            <h3>HW5(Web API)</h3>

            <p>If you would like to see my <strong>List users API</strong> open up in a new tab,
                click <a href="webUser/getAll" target="_blank">here</a>.<br /></p>

            <p>If you would like to see my <strong>List Car API</strong> open up in a new tab,
                click <a href="car/getAll" target="_blank">here</a>.<br /></p>

            <p>If you would like to see my <strong>Web API Error document</strong> open up in a new tab,
                click <a target="_blank" href="docs/WebAPIError.pdf">here</a></p>

            <p>Since, I do not have any experience of writing server side code, I thought it would be a bit difficult for me. However, the lab activity and other tutorial helped me understand and complete the homework. I didn't find anything confusing in this module. </p>

            <h3>HW6(Show Data)</h3>
            <p>I learned about using json files and displaying data from database in json format. I also learned about sortable and filterable component from this week module, and I found it easier to understand compared to other topics. I did not find anything confusing in this module.</p>

            <h3>HW07(Logon)</h3>
            <p>I learned about session object and user login and logout system from this homework. I did not find anything confusing, but I did find it difficult to implement logon api.</p>

            <h3>HW08(Insert)</h3>
            <p>I learned about adding insert API to insert records. The lab activity helped me in implementing the insert car for homework. I did miss last week homework and as a result was a bit confused initially to adjust the code. Hopefully, i will add the logon part later to it.</p>

            <h3>HW09(Update)</h3>
            <p>This week's homework was comparatively easy. I learned about adding update api for car records, and I did not find anything confusing.</p>

            <h3>HW10(Delete)</h3>
            <p>I found this homework a bit difficult as I was struggling to implement the deleteAPI, and also because we didn't do any lab activity on that. I did not find anything confusing with this homework, and I learned about implementing deleteAPI from this homework.</p>

        </div>
    );
}