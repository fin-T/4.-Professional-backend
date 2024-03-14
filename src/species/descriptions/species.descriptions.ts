export const CREATE = `To create a specie, you must pass the request body with the required <b>name</b> field.<br>
        Fields available for filling: <b>name</b>, <b>classification</b>, <b>designation</b>, <b>average_height</b>,
        <b>skin_colors</b>, <b>hair_colors</b>, <b>eye_colors</b>, <b>average_lifespan</b>, <b>homeworld</b>,
        <b>language</b>, <b>people</b>, <b>language</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/species/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the specie will not be created and the corresponding response will be 
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
    "name": "Zefiradant",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/species/98/"
    }`;

export const UPDATE = `To transfer data for updating, you must send request body.
        Fields available for filling: <b>name</b>, <b>classification</b>, <b>designation</b>, <b>average_height</b>,
        <b>skin_colors</b>, <b>hair_colors</b>, <b>eye_colors</b>, <b>average_lifespan</b>, <b>homeworld</b>,
        <b>language</b>, <b>people</b>, <b>language</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/species/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the specie will not be created and the corresponding response will be 
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
    "name": "Zefiradant",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/species/98/"
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

export const DELETE_IMAGES = `Removing links (urls) to images by specie and image identifiers.
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