import { constant } from "lodash";
import {ReservationStation} from "./ReservationStation";
import {RSinstructions} from "./RSinstructions";
import {RegisterFile} from "./RegisterFile";
import {LRUCache} from "./LRUCache";

//Components//
const InstructionQueue=require('./InstructionQueue');
const RegisterFile=new RegisterFile();
const DataCache=new LRUCache(6);
const StoreBuffer=new ReservationStation(4);
const LoadBuffer=new ReservationStation(4);
const adderRS=new ReservationStation(4);
const multRS=new ReservationStation(2);

