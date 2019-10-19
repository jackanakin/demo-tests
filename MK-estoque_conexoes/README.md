1. estoque.csv sql:
select ids.id, ids.id_serial_equip, ids.mac_serial
from mk_ids ids 
where ids.coditem = 583 AND ids.disponivel = 'S'

2. clientes.csv sql:
select con.codconexao, con.onu_serial, con.mac_address
from mk_conexoes con