const express = require("express");
const router = express.Router();
/* ==================== controllers ==================== */
const {
    getBoards,
    updateBoards,
    deleteBoards,
} = require("../controllers/boards");
const {
    getAllGifts,
    getSelectedGift,
    createGift,
    updateGift,
    deleteGift,
} = require("../controllers/gifts");
const {
    getAllMenus,
    getSelectedMenu,
    createMenu,
    updateMenu,
    deleteMenu,
} = require("../controllers/menus");
const {
    getAllGiftQuestions,
    getSelectedGiftQuestion,
    createGiftQuestion,
    updateGiftQuestion,
    deleteGiftQuestion,
} = require("../controllers/giftQuestions");
const {
    getAllAdmins,
    getSelectedAdmin,
    createAdmin,
    loginAdmin,
    updateAdmin,
    initializePassword,
    deleteAdmin,
    updateMyPassword,
} = require("../controllers/admins");
const adminAuth = require("../controllers/auth");
const {
    getAllMoneyQuestion,
    getMoneyQuestion,
    createMoneyQuestions,
    updateMoneyQuestion,
    deleteMoneyQuestion,
} = require("../controllers/moneys");
const { getAllStatistics } = require("../controllers/statistics");
const { getUserAccessTime } = require("../controllers/userAccessTime");
/* ==================================================*/

/* ==================== middleware ====================*/
const upload = require("../middleware/upload");
const passportAutheticator = require("../middleware/authenticator");
/* ==================================================*/

/* ==================== router ==================== */
router.get("/boards", getBoards);
router.put("/boards/:board_id", updateBoards);
router.delete("/boards/:board_id", deleteBoards);

router.get("/gifts/", getAllGifts);
router.get("/gifts/:gift_id", getSelectedGift);
router.post("/gifts", upload.single("img"), createGift);
router.put("/gifts/:gift_id", updateGift);
router.delete("/gifts/:gift_id", deleteGift);

router.get("/menus", getAllMenus);
router.get("/menus/:menu_id", getSelectedMenu);
router.post("/menus", upload.single("img"), createMenu);
router.put("/menus/:menu_id", updateMenu);
router.delete("/menus/:menu_id", deleteMenu);

router.get("/giftQuestions", getAllGiftQuestions);
router.get("/giftQuestions/:giftQuestion_id", getSelectedGiftQuestion);
router.post("/giftQuestions", createGiftQuestion);
router.put("/giftQuestions/:giftQuestion_id", updateGiftQuestion);
router.delete("/giftQuestions/:giftQuestion_id", deleteGiftQuestion);

router.get("/admins", getAllAdmins);
router.get("/admins/:admin_id", getSelectedAdmin);
router.post("/sign-up", createAdmin);
router.post("/login", loginAdmin);
router.put("/admins/:admin_id", updateAdmin);
router.put("/admins/password/initialize", initializePassword);
router.delete("/admins/:admin_id", deleteAdmin);
router.put("/admins/password/change/:admin_id", updateMyPassword);

router.get("/auth", passportAutheticator(), adminAuth);

router.get("/moneyQuestions", getAllMoneyQuestion);
router.get("/moneyQuestions/:moneyQuestion_id", getMoneyQuestion);
router.post("/moneyQuestions", createMoneyQuestions);
router.put("/moneyQuestions/:moneyQuestion_id", updateMoneyQuestion);
router.delete("/moneyQuestions/:moneyQuestion_id", deleteMoneyQuestion);

router.get("/statistics", getAllStatistics);
router.get("/user", getUserAccessTime);
/* ==================================================*/

module.exports = router;
