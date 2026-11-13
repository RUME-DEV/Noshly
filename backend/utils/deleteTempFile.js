
import fs from "fs/promises"

const deleteTempFile = async (filePath) => {
    if (!filePath) return

    try {
        await fs.unlink(filePath)
    } catch (error) {
        // Ignore errors when the file has already been deleted
        if (error.code !== "ENOENT") {
            console.error("Temporary File Cleanup Error:", error.message)
        }
    }
}

export default deleteTempFile
