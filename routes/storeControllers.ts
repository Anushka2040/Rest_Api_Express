import { db } from "../models/db";
import { BasicStore } from "../types/store";
import { Request, Response } from "express";

const getOrderbystatus = (req: Request, res: Response) => {
  // let order_status = req.query.status;
  db.query(
    "SELECT status, COUNT(status) AS status_count FROM store GROUP BY status",
    (error, rows) => {
      console.log(rows);
      if (Object.keys(rows).length == 0) {
        res.status(404);
        res.json({ status: "NOT FOUND!" });
      } else {
        res.status(200);
        res.json(rows);
      }
    }
  );
};

const createOrder = (req: Request, res: Response) => {
  let order = req.body;
  db.query(
    "INSERT INTO store (petId, quantity, shipDate, status, complete) VALUES ( ? , ? , ? , ? , ? )",
    [order.petId, order.quantity, order.shipDate, order.status, order.complete],
    (error, result: BasicStore) => {
      if (error) {
        res.status(404);
        res.json({ status: "NOT CREATED!", message: error });
      } else {
        res.status(201);
        res.json(result);
      }
    }
  );
};

const getOrderbyid = (req: Request, res: Response) => {
  let order_id = req.params.id;
  db.query(
    "SELECT * FROM store WHERE id= ?",
    order_id,
    (error, result: BasicStore) => {
      if (Object.keys(result).length === 0) {
        res.status(404);
        res.json({ status: "NOT FOUND!" });
      } else {
        res.status(200);
        res.json(result);
      }
    }
  );
};

const deleteOrderbyid = (req: Request, res: Response) => {
  let order_id = req.params.id;
  db.query(
    "DELETE FROM store WHERE id= ?",
    order_id,
    (error, result: BasicStore) => {
      if (error) {
        res.status(404);
        res.json({ status: "NOT CREATED!", message: error });
      } else {
        res.status(201);
        res.json(result);
      }
    }
  );
};

export { getOrderbystatus, createOrder, getOrderbyid, deleteOrderbyid };
