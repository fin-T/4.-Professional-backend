export const CREATE = `To create a person, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>,
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>homeworld</b>, <b>species</b>, <b>vehicles</b>,
        <b>starships</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/people/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the person will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        This route is only available to administrators (with role "admin").`;

export const UPDATE = `To transfer data for updating, you must sendrequest body.
        Fields available for filling: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>,
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>species</b>, <b>vehicles</b>, <b>starships</b>,
        <b>films</b>, <b>homeworld</b>, <b>url</b>,
        <b>images</b> (value is an array of urls for images. Supported formats: jpg, jpeg, png, gif).
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/people/1/).
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the person will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        This route is only available to administrators (with role "admin").`;

export const DELETE = `This route is only available to administrators (with role "admin").`;

export const DOWNLOAD_IMAGES = `Loading links (urls) to images. <br>
        Supported formats: <i>"jpeg"</i>, <i>"jpg"</i>, <i>"png"</i>, <i>"gif"</i>.
        <br><br>
        This route is only available to administrators (with role "admin").`;

export const DELETE_IMAGES = `Removing links (urls) to images by person and image identifiers.
        <br><br>
        This route is only available to administrators (with role "admin").`;
