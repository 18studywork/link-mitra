const MASTER_PIN = "199512";
function unlockVault(){
  const pin = document.getElementById("pin").value;
  document.getElementById("message").innerHTML =
    pin === MASTER_PIN ? "✅ Vault Unlocked" : "❌ Wrong PIN";
}