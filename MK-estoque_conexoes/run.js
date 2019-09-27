var fs = require("fs"),
  readline = require("readline");
const util = require("util");

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function getData() {
  const stockData = await readFile("estoque.csv");
  const stockLines = stockData.split("\n");
  const customerData = await readFile("clientes.csv");
  const customerLines = customerData.split("\n");

  let items = [],
    customers = [];

  stockLines.forEach(element => {
    items.push(element.replace("\r", "").split(","));
  });
  customerLines.forEach(element => {
    customers.push(element.replace("\r", "").split(","));
  });

  return [items, customers];
}

async function main() {
  let matched = [];
  const [items, customers] = await getData();

  items.forEach((item, i) => {
    if (i === 0) return;
    const [item_id, id_serial_equip, mac_serial] = item;

    customers.forEach((customer, i) => {
      if (i === 0) return;
      const [codconexao, onu_serial, mac_address] = customer;

      /// START mac_address
      if (
        unDotted(mac_address) &&
        unDotted(mac_address).includes(item_id) &&
        item_id.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }
      
      if (
        unDotted(mac_address) &&
        unDotted(mac_address).includes(item_id.slice(4)) &&
        item_id.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        unDotted(mac_address) &&
        unDotted(mac_address).includes(id_serial_equip) &&
        id_serial_equip.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        isValid(mac_serial) &&
        mac_serial &&
        unDotted(mac_address) &&
        unDotted(mac_address).includes(mac_serial.slice(4)) &&
        id_serial_equip.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      /////////////////////
      if (
        subMac(mac_address) &&
        isValid(id_serial_equip) &&
        subMac(mac_address).includes(id_serial_equip.slice(4)) &&
        id_serial_equip.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      /// END mac_address

      /// START onu_serial
      if (
        onu_serial &&
        onu_serial.includes(item_id) &&
        isValid(onu_serial) &&
        item_id.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        onu_serial.includes(item_id.slice(4)) &&
        isValid(onu_serial) &&
        item_id.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        onu_serial.includes(id_serial_equip) &&
        isValid(onu_serial) &&
        id_serial_equip.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        onu_serial.includes(id_serial_equip.slice(4)) &&
        isValid(onu_serial) &&
        isValid(id_serial_equip) &&
        id_serial_equip.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        onu_serial.includes(mac_serial) &&
        isValid(onu_serial) &&
        mac_serial.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        mac_serial &&
        onu_serial.includes(mac_serial.slice(4)) &&
        isValid(mac_serial) &&
        isValid(onu_serial) &&
        mac_serial.length > 0
      ) {
        matched.push({ codconexao, item_id });
        return;
      }
      /// END onu_serial

      /// START item_id
      if (item_id.includes(onu_serial) && isValid(onu_serial)) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        item_id.includes(unDotted(mac_address)) ||
        item_id.includes(subMac(mac_address))
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        item_id.includes(onu_serial.slice(4)) &&
        isValid(onu_serial)
      ) {
        matched.push({ codconexao, item_id });
        return;
      }
      /// END item_id

      /// START id_serial_equip
      if (id_serial_equip.includes(onu_serial) && isValid(onu_serial)) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        id_serial_equip.includes(unDotted(mac_address)) ||
        id_serial_equip.includes(subMac(mac_address))
      ) {
        matched.push({ codconexao, item_id });
        return;
      }

      if (
        onu_serial &&
        id_serial_equip.includes(onu_serial.slice(4)) &&
        isValid(onu_serial)
      ) {
        matched.push({ codconexao, item_id });
        return;
      }
      /// END id_serial_equip

      /// START mac_serial
      if (
        mac_serial &&
        onu_serial &&
        mac_serial.includes(onu_serial.slice(4)) &&
        isValid(onu_serial)
      ) {
        matched.push({ codconexao, item_id });
        return;
      }
      /// END mac_serial
    });
  });

  console.log(matched);
  fs.writeFile("final.csv", JSON.stringify(matched), err => {
    // In case of a error throw err.
    if (err) throw err;
  });
}

function isValid(fieldName) {
  if (fieldName == "ZNTS") return false;
  if (fieldName == "NULL") return false;
  return true;
}

function unDotted(mac) {
  if (!mac) return null;

  while (mac.includes(":")) {
    mac = mac.replace(":", "");
  }
  return mac;
}

function subMac(mac) {
  if (!mac) return null;

  while (mac.includes(":")) {
    mac = mac.replace(":", "");
  }
  return mac.replace(":", "").slice(4);
}

main();
