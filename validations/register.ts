import { body } from 'express-validator'

export const registerValidations = [
    body('email', "Введите E-Mail").isEmail().withMessage("Неверный E-Mail").isLength({
        min: 10,
        max: 40
    }).withMessage("Допустимое кол-во символов в почте от 10 до 40."),

    body('fullname', "Введите имя").isString().isLength({
        min: 2,
        max: 40
    }).withMessage("Допустимое кол-во символов в имени от 2 до 40."),

    body('username', "Укажите логин").isString().isLength({
        min: 2,
        max: 40
    }).withMessage("Допустимое кол-во символов в логине от 2 до 40."),

    body('password', "Укажите пароль").isString().isLength({
        min: 6,
    }).withMessage("Пароль должен быть минимум 6 символов.")
    .custom((value, {req}) => {
        if(value !== req.body.password2){
            throw new Error("Пароль не совпадают");
        }else  {
            return value
        }
    }),
]


    // body('password2').isString().isLength({
    //     min: 6,
    // }).withMessage("Минимальная длинная пароля 6 символов")
    // ,

    // body('location', "Укажите пароль").isString().isLength({
    //     min: 6,
    // }).withMessage("Пароль должен быть минимум 6 символов."), 2:00:26