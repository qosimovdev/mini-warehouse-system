const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./src/config/db")
const errorHandler = require("./src/middlewares/error.middleware")

dotenv.config()
connectDB()


const app = express()
app.use(express.json())
app.use(cors())

app.use(errorHandler)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const authRoutes = require("./src/routes/auth.route")
const productRoutes = require("./src/routes/product.route")
const purchaseRoutes = require("./src/routes/purchase.route")
const companyRoutes = require("./src/routes/company.route")
const historyRoutes = require("./src/routes/history.route")


app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/purchase", purchaseRoutes)
app.use("/api/company", companyRoutes)
app.use("/api/history", historyRoutes)