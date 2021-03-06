const admins = require("../models/admins");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function getAllAdmins(req, res) {
    try {
        const allAdmins = await admins.find({});
        res.status(200).send(allAdmins);
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "전체 관리자 조회에 실패하였습니다!",
        });
    }
}

async function getSelectedAdmin(req, res) {
    try {
        const { admin_id } = req.params;
        const selectedAdmin = await admins.findOne({ admin_id });
        if (!selectedAdmin) {
            res.status(400).send({
                errorMessage: "존재하지 않는 정보입니다!",
            });
            return;
        }
        res.status(200).send(selectedAdmin);
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "개별 관리자 조회에 실패하였습니다!",
        });
    }
}

async function createAdmin(req, res) {
    try {
        const { adminPosition, adminName, adminNickname } = req.body;
        const password = process.env.ADMIN_DEFAULT_PASSWORD;
        const existUser = await admins.findOne({ adminNickname });
        if (existUser) {
            res.status(400).send({
                errorMessage: "이미 등록된 닉네임입니다!",
            });
            return;
        }
        const encryptPW = await bcrypt.hash(password, 13);
        await admins.create({
            adminPosition,
            adminName,
            adminNickname,
            password: encryptPW,
        });
        res.status(201).send();
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "관리자 등록에 실패하였습니다!",
        });
    }
}

async function loginAdmin(req, res) {
    try {
        passport.authenticate("local", (error, admin, detail) => {
            if (error || !admin) {
                res.status(400).send({
                    errorMessage: detail.errorMessage,
                });
                return;
            }
            return req.login(admin, { session: false }, (loginError) => {
                if (loginError) {
                    res.status(400).send({
                        errorMessage: detail.errorMessage,
                    });
                }
                const token = jwt.sign(
                    {
                        nickname: admin.adminNickname,
                        position: admin.adminPosition,
                    },
                    process.env.JWT_SECRET_KEY
                );
                res.status(200).send({ token });
                return;
            });
        })(req, res);
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "로그인에 실패하였습니다!",
        });
    }
}

async function updateAdmin(req, res) {
    try {
        const { admin_id } = req.params;
        const changedAdminInfo = await admins.findOne({ admin_id });
        if (!changedAdminInfo) {
            res.status(400).send({
                errorMessage: "존재하지 않는 정보입니다!",
            });
            return;
        }

        const { adminPosition, adminName, adminNickname, master_id, password } =
            req.body;

        const masterAdminInfo = await admins.findOne({ admin_id: master_id });
        if (masterAdminInfo.adminPosition != "master") {
            res.status(403).send({
                errorMessage: "변경 권한이 없습니다!",
            });
            return;
        }

        const comparePassword = await bcrypt.compare(
            password,
            masterAdminInfo.password
        );
        if (!comparePassword) {
            res.status(403).send({
                errorMessage: "비밀번호가 일치하지 않습니다!",
            });
            return;
        }

        await admins.updateOne(
            { admin_id },
            {
                $set: {
                    adminPosition,
                    adminName,
                    adminNickname,
                },
            }
        );
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "관리자 등록에 실패하였습니다!",
        });
    }
}

async function initializePassword(req, res) {
    try {
        const { adminPosition, adminName, adminNickname } = req.body;
        const adminInfo = await admins.findOne({ adminNickname });
        if (!adminInfo) {
            res.status(400).send({
                errorMessage: "존재하지 않는 정보입니다!",
            });
            return;
        }
        if (
            adminPosition != adminInfo.adminPosition ||
            adminName != adminInfo.adminName
        ) {
            res.status(400).send({
                errorMessage: "정보가 일치하지 않습니다!",
            });
            return;
        }
        const password = process.env.ADMIN_DEFAULT_PASSWORD;
        const encryptPW = await bcrypt.hash(password, 13);
        await admins.updateOne(
            { adminNickname },
            { $set: { password: encryptPW } }
        );
        res.status(200).send({
            successMessage: `비밀번호를 ${password} 로 초기화 했습니다!`,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "비밀번호 초기화에 실패하였습니다!",
        });
    }
}

async function deleteAdmin(req, res) {
    try {
        const { admin_id } = req.params;
        const selectedAdmin = await admins.findOne({ admin_id });
        if (!selectedAdmin) {
            res.status(400).send({
                errorMessage: "존재하지 않는 정보입니다!",
            });
            return;
        }
        await admins.deleteOne({ admin_id });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "관리자 삭제에 실패하였습니다!",
        });
    }
}

async function updateMyPassword(req, res) {
    try {
        const { admin_id } = req.params;
        const { password } = req.body;
        const encryptPW = await bcrypt.hash(password, 13);

        await admins.updateOne({ admin_id }, { $set: { password: encryptPW } });

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "비밀번호 변경에 실패하였습니다!",
        });
    }
}

module.exports = {
    getAllAdmins,
    getSelectedAdmin,
    createAdmin,
    loginAdmin,
    updateAdmin,
    initializePassword,
    deleteAdmin,
    updateMyPassword,
};
