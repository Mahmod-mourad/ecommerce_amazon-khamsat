import nodemailer from "nodemailer"

export async function sendOrderConfirmation(order: any) {
  // Create a test account if we're in development
  const testAccount = await nodemailer.createTestAccount()

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER || "smtp.ethereal.email",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  })

  // Format the order items
  const itemsList = order.items
    .map((item: any) => `${item.product.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join("<br>")

  // Send the email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"AmaClone Store" <store@amaclone.com>',
    to: "mm203197@gmail.com", // Send to the store admin
    cc: order.user.email, // Send a copy to the customer
    subject: `New Order #${order.id}`,
    html: `
      <h1>New Order Received</h1>
      <p>A new order has been placed by ${order.user.name}.</p>
      
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Payment Method:</strong> Cash on Delivery</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      
      <h2>Items</h2>
      <p>${itemsList}</p>
      
      <h2>Shipping Information</h2>
      <p><strong>Name:</strong> ${order.shippingDetails.fullName}</p>
      <p><strong>Address:</strong> ${order.shippingDetails.address}</p>
      <p><strong>City:</strong> ${order.shippingDetails.city}</p>
      <p><strong>State:</strong> ${order.shippingDetails.state}</p>
      <p><strong>Zip Code:</strong> ${order.shippingDetails.zipCode}</p>
      <p><strong>Country:</strong> ${order.shippingDetails.country}</p>
      <p><strong>Phone:</strong> ${order.shippingDetails.phone}</p>
      
      <p>Thank you for your order!</p>
    `,
  })

  console.log("Message sent: %s", info.messageId)

  // Preview URL for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  }

  return info
}
