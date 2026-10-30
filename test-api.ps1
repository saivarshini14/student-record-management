$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$mvn = "C:\Users\ADMIN\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd"
$backendDir = "C:\Users\ADMIN\.gemini\antigravity\scratch\student-record-management\backend"

Write-Host "Starting Spring Boot application with Start-Process..."
$proc = Start-Process -FilePath $mvn -ArgumentList "spring-boot:run" -WorkingDirectory $backendDir -PassThru

$started = $false
$maxRetries = 25
$retry = 0

Write-Host "Waiting for backend on http://localhost:8080/api/students..."
while (-not $started -and $retry -lt $maxRetries) {
    Start-Sleep -Seconds 2
    $retry++
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:8080/api/students" -Method Get -TimeoutSec 2 -ErrorAction Stop
        if ($res -and $res.success) {
            $started = $true
            Write-Host "Backend is online! (Attempt $retry)"
        }
    } catch {
        Write-Host "Waiting... ($retry/$maxRetries)"
    }
}

if (-not $started) {
    Write-Host "Backend failed to start within timeout."
    if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
    exit 1
}

$allPassed = $true

# TEST 1: Stats
Write-Host "`n--- TEST 1: Check Total Registered Students (/api/students/stats) ---"
try {
    $statsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students/stats" -Method Get
    Write-Host "Total students registered: $($statsRes.data.totalStudents)"
    Write-Host "Average marks: $($statsRes.data.averageMarks)"
    Write-Host "Pass percentage: $($statsRes.data.passPercentage)%"
    if ($statsRes.data.totalStudents -gt 0) {
        Write-Host "PASS: Total students returned correctly." -ForegroundColor Green
    } else {
        Write-Host "FAIL: Total students was 0." -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "FAIL in Test 1: $_" -ForegroundColor Red
    $allPassed = $false
}

# TEST 2: Add Student
Write-Host "`n--- TEST 2: Add Student with valid data ---"
$newStudentId = $null
try {
    $body = @{
        name = "Kavya Ramesh"
        rollNumber = "CS2026-TEST"
        branch = "Computer Science"
        marks = 92.5
    } | ConvertTo-Json

    $addRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students" -Method Post -Body $body -ContentType "application/json"
    $newStudentId = $addRes.data.id
    Write-Host "Created student ID: $newStudentId, Name: $($addRes.data.name), Roll: $($addRes.data.rollNumber), Grade: $($addRes.data.grade)"
    if ($addRes.data.rollNumber -eq "CS2026-TEST" -and $addRes.data.grade -eq "A+") {
        Write-Host "PASS: Student created with correct grade and details." -ForegroundColor Green
    } else {
        Write-Host "FAIL in student attributes." -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "FAIL in Test 2: $_" -ForegroundColor Red
    $allPassed = $false
}

# TEST 3: Duplicate Roll Number Check
Write-Host "`n--- TEST 3: Duplicate Roll Number validation ---"
try {
    $dupBody = @{
        name = "Another Student"
        rollNumber = "cs2026-test"
        branch = "Mechanical"
        marks = 75.0
    } | ConvertTo-Json

    $dupRes = Invoke-WebRequest -Uri "http://localhost:8080/api/students" -Method Post -Body $dupBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "FAIL: Duplicate roll number was accepted unexpectedly." -ForegroundColor Red
    $allPassed = $false
} catch {
    $errResp = $_.Exception.Response
    Write-Host "Expected error caught. Status code: $($errResp.StatusCode.value__)"
    if ($errResp.StatusCode.value__ -eq 409) {
        Write-Host "PASS: Duplicate roll number rejected with 409 Conflict." -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 409 Conflict, got $($errResp.StatusCode.value__)" -ForegroundColor Red
        $allPassed = $false
    }
}

# TEST 4: Invalid Marks (< 0 or > 100)
Write-Host "`n--- TEST 4: Invalid Marks validation (> 100) ---"
try {
    $invalidBody = @{
        name = "Overachiever Student"
        rollNumber = "INVALID-001"
        branch = "Civil"
        marks = 150.0
    } | ConvertTo-Json

    $invalidRes = Invoke-WebRequest -Uri "http://localhost:8080/api/students" -Method Post -Body $invalidBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "FAIL: Invalid marks (> 100) was accepted unexpectedly." -ForegroundColor Red
    $allPassed = $false
} catch {
    $errResp = $_.Exception.Response
    Write-Host "Expected error caught. Status code: $($errResp.StatusCode.value__)"
    if ($errResp.StatusCode.value__ -eq 400) {
        Write-Host "PASS: Invalid marks rejected with 400 Bad Request." -ForegroundColor Green
    } else {
        Write-Host "FAIL: Expected 400, got $($errResp.StatusCode.value__)" -ForegroundColor Red
        $allPassed = $false
    }
}

# TEST 5: Search By Roll Number
Write-Host "`n--- TEST 5: Search by Roll Number ---"
try {
    $srchRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students/search?rollNumber=CS2026-TEST" -Method Get
    Write-Host "Found $($srchRes.data.Count) student matching search."
    if ($srchRes.data.Count -ge 1 -and $srchRes.data[0].rollNumber -eq "CS2026-TEST") {
        Write-Host "PASS: Search by roll number verified." -ForegroundColor Green
    } else {
        Write-Host "FAIL: Student not found in search." -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "FAIL in Test 5: $_" -ForegroundColor Red
    $allPassed = $false
}

# TEST 6: Update Student
Write-Host "`n--- TEST 6: Update Student Record ---"
if ($newStudentId) {
    try {
        $updateBody = @{
            name = "Kavya Ramesh Updated"
            rollNumber = "CS2026-TEST"
            branch = "Computer Science & AI"
            marks = 98.0
        } | ConvertTo-Json

        $updRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students/$newStudentId" -Method Put -Body $updateBody -ContentType "application/json"
        Write-Host "Updated Name: $($updRes.data.name), Branch: $($updRes.data.branch), Marks: $($updRes.data.marks)"
        if ($updRes.data.name -eq "Kavya Ramesh Updated" -and $updRes.data.marks -eq 98.0) {
            Write-Host "PASS: Student updated successfully." -ForegroundColor Green
        } else {
            Write-Host "FAIL: Update attributes mismatch." -ForegroundColor Red
            $allPassed = $false
        }
    } catch {
        Write-Host "FAIL in Test 6: $_" -ForegroundColor Red
        $allPassed = $false
    }
}

# TEST 7: Delete Student
Write-Host "`n--- TEST 7: Delete Student Record ---"
if ($newStudentId) {
    try {
        $delRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students/$newStudentId" -Method Delete
        Write-Host "Delete response: $($delRes.message)"
        
        # Verify deleted
        $verifyRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students/search?rollNumber=CS2026-TEST" -Method Get
        if ($verifyRes.data.Count -eq 0) {
            Write-Host "PASS: Student deleted and verified removed." -ForegroundColor Green
        } else {
            Write-Host "FAIL: Student still present after delete." -ForegroundColor Red
            $allPassed = $false
        }
    } catch {
        Write-Host "FAIL in Test 7: $_" -ForegroundColor Red
        $allPassed = $false
    }
}

# Cleanup
Write-Host "`nShutting down backend process..."
try {
    if ($proc -and -not $proc.HasExited) {
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "student-record" } | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}

Write-Host "=========================================="
if ($allPassed) {
    Write-Host "ALL REST API REQUIREMENTS VERIFIED SUCCESSFULLY!" -ForegroundColor Green
} else {
    Write-Host "SOME TESTS FAILED." -ForegroundColor Red
}
Write-Host "=========================================="
