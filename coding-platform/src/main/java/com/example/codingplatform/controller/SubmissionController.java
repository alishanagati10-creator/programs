package com.example.codingplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.io.*;

import com.example.codingplatform.model.Submission;
import com.example.codingplatform.model.User;
import com.example.codingplatform.model.Problem;
import com.example.codingplatform.repository.SubmissionRepository;
import com.example.codingplatform.repository.UserRepository;
import com.example.codingplatform.repository.ProblemRepository;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;

    public SubmissionController(SubmissionRepository submissionRepository,
                                UserRepository userRepository,
                                ProblemRepository problemRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
    }

    // ✅ GET ALL
    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    // ✅ LEADERBOARD
    @GetMapping("/leaderboard")
    public List<Map<String, Object>> getLeaderboard() {
        List<Object[]> data = submissionRepository.getLeaderboard();
        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (Object[] row : data) {
            Map<String, Object> map = new HashMap<>();
            map.put("username", row[0]);
            map.put("score", row[1]);
            leaderboard.add(map);
        }
        return leaderboard;
    }

    // ✅ SUBMIT
    @PostMapping
    public Submission addSubmission(@RequestBody Map<String, Object> request) {

        Long userId = Long.valueOf(request.get("userId").toString());
        Long problemId = Long.valueOf(request.get("problemId").toString());
        String code = request.get("code").toString();
        String input = request.get("input") != null ? request.get("input").toString() : "";

        User user = userRepository.findById(userId).orElse(null);
        Problem problem = problemRepository.findById(problemId).orElse(null);

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setCode(code);
        submission.setLanguage("Java");

        // 🔥 RUN CODE
        String output = runCode(code, input);

        System.out.println("RAW OUTPUT: [" + output + "]");

        // ❌ HANDLE ERROR
        if (output.contains("Exception") || output.contains("error")) {
            submission.setOutput(output);
            submission.setStatus("Error");
            return submissionRepository.save(submission);
        }

        submission.setOutput(output);

        // 🔥 EXPECTED OUTPUT
        String expected = getExpectedOutput(problem.getTitle(), input);

        System.out.println("RAW EXPECTED: [" + expected + "]");

        // ✅ CLEAN COMPARISON (FINAL FIX)
        String cleanOutput = output.trim().replaceAll("\\s+", " ");
        String cleanExpected = expected.trim().replaceAll("\\s+", " ");

        System.out.println("CLEAN OUTPUT: [" + cleanOutput + "]");
        System.out.println("CLEAN EXPECTED: [" + cleanExpected + "]");

        if (cleanOutput.equals(cleanExpected)) {
            submission.setStatus("Accepted");
        } else {
            submission.setStatus("Wrong Answer");
        }

        return submissionRepository.save(submission);
    }

    // ✅ RUN CODE
    // ✅ RUN CODE (UPDATED)
private String runCode(String code, String input) {
    try {
        File file = new File("Main.java");
        FileWriter writer = new FileWriter(file);
        writer.write(code);
        writer.close();

        Process compile = Runtime.getRuntime().exec("javac Main.java");
        compile.waitFor();

        Process run = Runtime.getRuntime().exec("java Main");

        // ✅ PASS INPUT CORRECTLY
        BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(run.getOutputStream()));
        bw.write(input);
        bw.flush();
        bw.close();

        BufferedReader br = new BufferedReader(
                new InputStreamReader(run.getInputStream()));

        BufferedReader errorReader = new BufferedReader(
                new InputStreamReader(run.getErrorStream()));

        StringBuilder output = new StringBuilder();
        String line;

        // ✅ READ NORMAL OUTPUT
        while ((line = br.readLine()) != null) {
            output.append(line).append("\n");
        }

        // ✅ READ ERRORS
        while ((line = errorReader.readLine()) != null) {
            output.append(line).append("\n");
        }

        return output.toString().trim();

    } catch (Exception e) {
        return "Error: " + e.getMessage();
    }
}
   

    // ✅ EXPECTED OUTPUT
    private String getExpectedOutput(String title, String input) {

        title = title.toLowerCase();
        String[] parts = input.split("\\s+");

        try {

           if (title.contains("two sum")) {

    try {
        // If input is like: 4 2 7 11 15 9
        if (parts.length >= 3) {

            int n = Integer.parseInt(parts[0]);

            // validate length
            if (parts.length < n + 2) {
                return "Error";
            }

            int[] arr = new int[n];

            for (int i = 0; i < n; i++) {
                arr[i] = Integer.parseInt(parts[i + 1]);
            }

            int target = Integer.parseInt(parts[n + 1]);

            Map<Integer, Integer> map = new HashMap<>();

            for (int i = 0; i < n; i++) {
                int comp = target - arr[i];

                if (map.containsKey(comp)) {
                    return map.get(comp) + " " + i;
                }
                map.put(arr[i], i);
            }
        }

        return "-1";

    } catch (Exception e) {
        System.out.println("TWO SUM ERROR: " + e.getMessage());
        return "Error";
    }
}
            // 🔹 2. REVERSE STRING
            if (title.contains("reverse")) {
                return new StringBuilder(input).reverse().toString();
            }

            // 🔹 3. PALINDROME ✅ FIXED
            if (title.contains("palindrome")) {
                String s = input.trim();
                String rev = new StringBuilder(s).reverse().toString();
                return s.equals(rev) ? "Palindrome" : "Not Palindrome";
            }

            // 🔹 4. BINARY SEARCH
            if (title.contains("binary")) {

                int n = Integer.parseInt(parts[0]);
                int[] arr = new int[n];

                for (int i = 0; i < n; i++)
                    arr[i] = Integer.parseInt(parts[i + 1]);

                int target = Integer.parseInt(parts[n + 1]);

                int l = 0, r = n - 1;

                while (l <= r) {
                    int mid = (l + r) / 2;

                    if (arr[mid] == target)
                        return String.valueOf(mid);
                    else if (arr[mid] < target)
                        l = mid + 1;
                    else
                        r = mid - 1;
                }
                return "-1";
            }

            // 🔹 5. LONGEST SUBSTRING
            if (title.contains("longest")) {

                String s = input;
                Set<Character> set = new HashSet<>();

                int l = 0, max = 0;

                for (int r = 0; r < s.length(); r++) {
                    while (set.contains(s.charAt(r))) {
                        set.remove(s.charAt(l++));
                    }
                    set.add(s.charAt(r));
                    max = Math.max(max, r - l + 1);
                }
                return String.valueOf(max);
            }
            // 6. MERGE INTERVALS
             if (title.contains("merge")) {

           int n = Integer.parseInt(parts[0]);
           int[][] intervals = new int[n][2];

            int index = 1;

         for (int i = 0; i < n; i++) {
        intervals[i][0] = Integer.parseInt(parts[index++]);
        intervals[i][1] = Integer.parseInt(parts[index++]);
        }

        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

         List<int[]> merged = new ArrayList<>();

          for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.get(merged.size() - 1)[1] =
                Math.max(merged.get(merged.size() - 1)[1], interval[1]);
        }
    }

    StringBuilder result = new StringBuilder();

    for (int[] arr : merged) {
        result.append(arr[0]).append(" ").append(arr[1]).append("\n");
    }

    return result.toString().trim();
}

            // 🔹 7. VALID PARENTHESES
            if (title.contains("parentheses")) {

                Stack<Character> stack = new Stack<>();

                for (char c : input.toCharArray()) {
                    if (c == '(') stack.push(')');
                    else if (c == '{') stack.push('}');
                    else if (c == '[') stack.push(']');
                    else {
                        if (stack.isEmpty() || stack.pop() != c)
                            return "false";
                    }
                }
                return stack.isEmpty() ? "true" : "false";
            }

            // 🔹 8. CLIMBING STAIRS
            if (title.contains("climbing")) {

                int n = Integer.parseInt(input);

                if (n <= 2) return String.valueOf(n);

                int a = 1, b = 2;

                for (int i = 3; i <= n; i++) {
                    int c = a + b;
                    a = b;
                    b = c;
                }
                return String.valueOf(b);
            }

        } catch (Exception e) {
            return "Error";
        }

        return "UNKNOWN";
    }
}