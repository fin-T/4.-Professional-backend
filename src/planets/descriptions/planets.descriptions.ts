export const CREATE = `To create a planet, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>rotation_period</b>, <b>orbital_period</b>, <b>diameter</b>,
        <b>climate</b>, <b>gravity</b>, <b>terrain</b>, <b>surface_water</b>, <b>population</b>, <b>residents< /b>,
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/planets/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the planet will not be created and the corresponding response will be 
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
    "name": "Zefira",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/planets/98/"
    }`;

export const UPDATE = `To transfer data for updating, you must send request body.
        Fields available for filling: <b>name</b>, <b>rotation_period</b>, <b>orbital_period</b>, <b>diameter</b>,
        <b>climate</b>, <b>gravity</b>, <b>terrain</b>, <b>surface_water</b>, <b>population</b>, <b>residents< /b>,
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>films</b>,
        <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/planets/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the planet will not be created and the corresponding response will be 
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
    "name": "Roma",
    "films": [ "https://swapi.dev/api/films/4/", "https://swapi.dev/api/films/3/" ],
    "url": "https://update-domain.dev/api/planets/98/"
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

export const DELETE_IMAGES = `Removing links (urls) to images by planet and image identifiers.
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