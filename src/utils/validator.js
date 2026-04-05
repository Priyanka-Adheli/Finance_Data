import validator from 'validator';

//common validations for user Data
const validate = (data) => {

    const mandortyField = ['name', 'email', 'password'];

    const IsAllowed = mandortyField.every((key) => Object.keys(data).includes(key));
    if (!IsAllowed)
        throw new Error("Field Missing");

    if (!validator.isEmail(data.email))
        throw new Error("Invalid Email Format");

    if (!validator.isStrongPassword(data.password))
        throw new Error("Weak Password");

    if (data.name.length <= 2)
        throw new Error("FirstName should of atleast 3 charaters");
}

export const validateFinance = (data, isUpdate = false) => {

    //for create finance record validation
    if (!isUpdate) {
        const mandatoryFields = ['amount', 'type', 'category', 'date'];
        const isAllowed = mandatoryFields.every((key) => Object.keys(data).includes(key) && data[key] !== undefined && data[key] !== null && data[key] !== '');
        if (!isAllowed) {
            throw new Error("Missing required fields");
        }
    }

    //for update finance record validation
    if (data.amount !== undefined) {
        if (isNaN(data.amount) || Number(data.amount) <= 0) {
            throw new Error("Amount must be a positive number");
        }
    }

    if (data.type !== undefined) {
        if (data.type !== 'income' && data.type !== 'expense') {
            throw new Error("Type must be either 'income' or 'expense'");
        }
    }

    if (data.date !== undefined) {
        if (isNaN(Date.parse(data.date))) {
            throw new Error("Invalid Date format");
        }
    }
}

export default validate;