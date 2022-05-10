const db = require("../models");
//  level3 หัวหน้าภาค

    /*
        /statusPrivate/:purchase_id
        
        purchase_id = id ของ purchase

        เปลี่ยน status ของ purchase
    */
    const statusPrivate = async (req, res) => {
        const {purchase_id} = req.params;
        const { status_purchase } = req.body;
        const findTarget = await db.Purchase.findOne({ where: { purchase_id: purchase_id } });
    
        if (findTarget) {
          await findTarget.update({
            ...findTarget,
            status_purchase,
          });
          res.status(200).send();
        } else {
          res.status(404).send({ message: "Not Found" });
        }
    };

module.exports = {
    statusPrivate,
};