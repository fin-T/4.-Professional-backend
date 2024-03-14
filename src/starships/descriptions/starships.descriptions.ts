export const CREATE = `To create a starship, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>model</b>, <b>model</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>hyperdrive_rating</b>, <b>MGLT</b>, <b>starship_class</b>, <b>pilots</b>,
        <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/starships/3/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, starship will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        This route is only available to administrators, so the request body must also include the 
        <b>username</b> and <b>password</b> fields. Provide the logged in user details in the values of 
        these fields.
        <br><br>

    Example request: \n
    {
    "username": "existingLogin",
    "password": "rightPassword",
    "name": "Piratship",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ],
    "url": "https://default-domain.dev/api/starships/98/"
    }`;

export const UPDATE = `To transfer data for updating, you must send request body.
        Fields available for filling: <b>name</b>, <b>model</b>, <b>model</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>hyperdrive_rating</b>, <b>MGLT</b>, <b>starship_class</b>, <b>pilots</b>,
        <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/starships/3/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, starship will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        This route is only available to administrators, so the request body must also include the 
        <b>username</b> and <b>password</b> fields. Provide the logged in user details in the values of 
        these fields.
        <br><br>

    Example request: \n
    {
    "username": "existingLogin",
    "password": "rightPassword",
    "name": "Piratship",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ]
    }`;

export const DELETE = `This route is only available to administrators, so the request body must also include 
        the <b>username</b> and <b>password</b> fields. Provide the logged in user details in the values of 
        these fields.   
        <br><br>

    Example request: \n
    {
    "username": "existingLogin",
    "password": "rightPassword"
    }`;

export const DOWNLOAD_IMAGES = `Loading links (urls) to images. <br>
        Supported formats: <i>"jpeg"</i>, <i>"jpg"</i>, <i>"png"</i>, <i>"gif"</i>. <br>
        To download links to images, you need to send the request body with the <b>ursl</b> field.
        <br><br>
        This route is only available to administrators, so the request body must also include the 
        <b>username</b> and <b>password</b> fields. Provide the logged in user details in the values of 
        these fields.
        <br><br>

    Example request: \n
    {
    "username": "existingLogin",
    "password": "rightPassword",
    "urls": [ "https://domainname.12223.jpeg", "https://dsds.asdsad.12321.png"]
    }`;

export const DELETE_IMAGES = `Removing links (urls) to images by starship and image identifiers.
        <br><br>
        This route is only available to administrators, so the request body must also include 
        the <b>username</b> and <b>password</b> fields. Provide the logged in user details in the values of 
        these fields.   
        <br><br>

    Example request: \n
    {
    "username": "existingLogin",
    "password": "rightPassword"
    }`;