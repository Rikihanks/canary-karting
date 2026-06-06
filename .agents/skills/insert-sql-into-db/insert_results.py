import sqlite3

db_path = 'D:/canary-karting/backend/database.sqlite'

sqls = [
]

con = sqlite3.connect(db_path)
cur = con.cursor()
cur.execute('SELECT COALESCE(MAX(id), 0) FROM results')
last_id = cur.fetchone()[0]

for i, sql in enumerate(sqls, start=1):
    new_id = last_id + i
    final_sql = sql.replace('{id}', str(new_id))
    cur.execute(final_sql)
    print(f'[OK] id={new_id}')

con.commit()
con.close()
print(f'\nInsertadas {len(sqls)} filas. Último ID usado: {last_id + len(sqls)}')
