<?php

$totalBill = 0;
$allMealDays = 22;
$skippedDinners = 12;

// Assume all meals taken for 22 days
$totalBill = 22 * (40 + 80 + 70);

// Remaining 8 days: breakfast and lunch only
$totalBill += 8 * (40 + 80);

if ($allMealDays >= 20) {
    $totalBill = $totalBill - ($totalBill * 0.12);
}

if ($skippedDinners > 10) {
    $totalBill += 200;
}

echo "Monthly Bill = ₹" . $totalBill;

?>