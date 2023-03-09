import { model, Model, Schema } from "mongoose";
import { BENEFICIARY_TYPE } from "../types";

const beneficiarySchema = new Schema<BENEFICIARY_TYPE, Model<BENEFICIARY_TYPE>>(
  {
    name: {
      type: String,
    },

    mothersName: {
      type: String,
    },

    fatherOrHusbandName: {
      type: String,
    },
    category: {
      type: String,
    },
    priority: {
      type: Number,
    },
    schemeCode: {
      type: String,
    },

    bank: {
      bankName: {
        type: String,
      },
      branchName: {
        type: String,
      },

      IFSCCode: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
    },
    sanctionNo: {
      type: String,
    },
    amountReleased: {
      type: Number,
    },
    installment: {
      type: Number,
    },
    creditDate: {
      type: Date,
    },
    houseStatus: {
      type: String,
    },
    inspectionDate: {
      type: Date,
    },

    address: {
      panchayat: {
        type: String,
      },
      village: {
        type: String,
      },
    },

    regNo: {
      type: String,
    },
  },
  { timestamps: true }
);

const BeneficiarySchema = model<BENEFICIARY_TYPE, Model<BENEFICIARY_TYPE>>(
  "Beneficiary",
  beneficiarySchema
);
BeneficiarySchema.syncIndexes();
export default BeneficiarySchema;
