export const CREATE = `To create a vehicle, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>model</b>, <b>manufacturer</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>vehicle_class</b>, <b>pilots</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/vehicles/4/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the vehicle will not be created and the corresponding response will be
        returned to you.
        <br><br>
        This route is only available to administrators (with role "admin").`;

export const UPDATE = `To transfer data for updating, you must send the request body.
        Fields available for filling: <b>name</b>, <b>model</b>, <b>manufacturer</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>vehicle_class</b>, <b>pilots</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/vehicles/4/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the vehicle will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        This route is only available to administrators (with role "admin").`;

export const DELETE = `This route is only available to administrators (with role "admin").`;

export const DOWNLOAD_IMAGES = `Loading links (urls) to images. <br>
        Supported formats: <i>"jpeg"</i>, <i>"jpg"</i>, <i>"png"</i>, <i>"gif"</i>. <br>
        <br><br>
        This route is only available to administrators (with role "admin").`;

export const DELETE_IMAGES = `Removing links (urls) to images by vehicle and image identifiers.
        <br><br>
        This route is only available to administrators (with role "admin").`;
