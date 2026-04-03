const db = require('./db');

console.log("🔍 CHECKING FOR DUPLICATE COLLEGES...");

db.all("SELECT name, COUNT(*) as count FROM colleges GROUP BY name HAVING count > 1", [], (err, rows) => {
    if (err) { console.error(err); return; }
    
    if (rows.length === 0) {
        console.log("✅ No duplicate names found.");
        process.exit(0);
    }

    console.log(`Found ${rows.length} duplicate names.`);
    
    // Resolve duplicates: keep only the one with the smallest ID
    const deleteSubagent = async (name) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT id FROM colleges WHERE name = ? ORDER BY id ASC", [name], (err, ids) => {
                if (err) return reject(err);
                const toDelete = ids.slice(1).map(i => i.id);
                if (toDelete.length === 0) return resolve();
                
                db.run(`DELETE FROM colleges WHERE id IN (${toDelete.join(',')})`, [], function(err) {
                    if (err) return reject(err);
                    console.log(`🗑️ Deleted ${this.changes} duplicates for: ${name}`);
                    resolve();
                });
            });
        });
    };

    Promise.all(rows.map(r => deleteSubagent(r.name)))
        .then(() => {
            console.log("✅ CLEANUP COMPLETE.");
            process.exit(0);
        })
        .catch(err => {
            console.error("Cleanup failed:", err);
            process.exit(1);
        });
});
