#!/bin/bash
input="/MK/mk_login.log"
printf -v date '%(%d/%m/%Y)T' -1
login_ok=0
login_erro=0

while IFS= read -r line
do
  if [[ $line == *"$date"* && $line == *"acabou de logar no sistema"* ]]; then
    index_start="expr index "$line" ("
    b="("
    printf -v ip  ${b}${line#*${b}}

    if [[
     $line == *"(127.0.0.1)"* || $line == *"(192.168.1.100)"*
    ]]; then
      ((login_ok+=1))
    else
      echo $line
      ((login_erro+=1))
    fi
  fi
done < "$input"

if [[ $login_erro > 0 ]]; then
  echo "0:$login_erro:ACESSO_NAO_AUTORIZADO"
else
  echo "0:0:OK"
fi
