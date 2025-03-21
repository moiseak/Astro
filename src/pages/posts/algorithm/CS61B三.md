---
layout: '/src/layouts/MarkdownPostLayout.astro'
title: "CS61B #3"  
description: "Gitlet"  
pubDate: 2024-10-28   
type: "Project" 
---
> 个人完成情况: 拿了满分, EC没做.
> 花费时间: 一周多, 40个小时左右,debug非常花时间.
> 项目地址: [GitHub - moiseak/CS61B-SP21](https://github.com/moiseak/CS61B-SP21)
> 摸鱼更新中...

# Classes and Data Structures
我的类结构其实很简单,就只有初始的几个类:Main, Reposity, Commit.
数据结构大多使用HashMap.
## Main
Main其实没什么好说的,我只把Main当作一个入口,没有定义其他的Fields or Functions.需要注意的无非就是几个特殊情况的处理.
```Java
public static void main(String[] args) {  
    // TODO: what if args is empty?  
    if (args.length == 0) {  
        System.out.println("Please enter a command.");  
        System.exit(0);  
    }  
    String firstArg = args[0];  
    switch(firstArg) {  
        case "init":  
            try {  
                Repository.init();  
            } catch (IOException e) {  
                throw new RuntimeException(e);  
            }  
            break;  
        case "add":  
            String secondArg = args[1];  
            try {  
                Repository.add(secondArg);  
            } catch (IOException e) {  
                throw new RuntimeException(e);  
            }  
            break;  
        case "commit":  
            //args : commit message  
            if (args.length == 1) {  
                System.out.println("Please enter a commit message.");  
                System.exit(0);  
            }  
            String secondArg1 = args[1];  
            if ("".equals(secondArg1)) {  
                System.out.println("Please enter a commit message.");  
                System.exit(0);  
            }  
            try {  
                Repository.commit(secondArg1);  
            } catch (IOException e) {  
                throw new RuntimeException(e);  
            }  
            break;  
        case "log":  
            Repository.log();  
            break;  
        case "checkout":  
            // maybe"--", commitId, or branch  
            String secondArg2 = args[1];  
            int len = args.length;  
            if (len == 3) {  
                if ("--".equals(secondArg2)) {  
                    //first arg checkout, second is "--", third is file name  
                    //checkout -- []                    // filename                    String thirdArg = args[2];  
                    //arg is filename  
                    try {  
                        Repository.checkout(thirdArg);  
                    } catch (IOException e) {  
                        throw new RuntimeException(e);  
                    }  
                }  
            } else if (len == 4){  
                String fourthArg = args[2];  
                if (Objects.equals(fourthArg, "--")) {  
                    //args: first is checkout, second is commitId, third is --", fourth is filename  
                    //checkout [] -- []  
                    //filename                    String fifthArg = args[3];  
                    //args are commitId and file name  
                    try {  
                        Repository.checkoutCommit(secondArg2, fifthArg);  
                    } catch (IOException e) {  
                        throw new RuntimeException(e);  
                    }  
                } else {  
                    System.out.println("Incorrect operands.");  
                    System.exit(0);  
                }  
            } else {  
                try {  
                    Repository.checkBranch(secondArg2);  
                } catch (IOException e) {  
                    throw new RuntimeException(e);  
                }  
            }  
            break;  
        case "rm":  
            String secondArg3 = args[1];  
            try {  
                Repository.rm(secondArg3);  
            } catch (IOException e) {  
                throw new RuntimeException(e);  
            }  
            break;  
        case "global-log":  
            Repository.logGlobal();  
            break;  
        case "find":  
            String secondArg4 = args[1];  
            Repository.find(secondArg4);  
            break;  
        case "status":  
            if (!Repository.GITLET_DIR.exists()) {  
                System.out.println("Not in an initialized Gitlet directory.");  
                System.exit(0);  
            }  
            Repository.status();  
            break;  
        case "branch":  
            String secondArg5 = args[1];  
            Repository.branch(secondArg5);  
            break;  
        case "rm-branch":  
            String secondArg6 = args[1];  
            Repository.rmBranch(secondArg6);  
            break;  
        case "reset":  
            String secondArg7 = args[1];  
            try {  
                Repository.reset(secondArg7);  
            } catch (IOException e) {  
                throw new RuntimeException(e);  
            }  
            break;  
        case "merge":  
            String secondArg8 = args[1];  
            try {  
                Repository.merge(secondArg8);  
            } catch (IOException e) {  
                throw new RuntimeException(e);  
            }  
            break;  
        default:  
            System.out.println("No command with that name exists.");  
            System.exit(0);  
    }
}
```

## Commit
### Fields
利用一个哈希表来存储文件与文件哈希值的映射
```Java
private final String message;  
private final String commitDate;  
private final String hashCodeCommit;  
private final String parent;  
private String parent2 = null;
//merge
private final String mergeMessage;  
//file and file hash value  
private HashMap<String, String> fileHashcode = new HashMap<>();
```
### Functions
使用了三个构造函数,一个是构造初始提交,一个是构造普通提交,一个是构造合并提交.
还有一个判断这个Commit是否追踪了某个文件的函数.
commit操作就不必多说了.
```Java
//about merge
public String getMergeMessage() {  
    return mergeMessage;  
}  
  
public String getParent2() {  
    return parent2;  
}
  
public Commit() {  
    this.message  = "initial commit";  
    this.mergeMessage = "";  
    Date d = new Date(0);  
    SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss yyyy Z", Locale.ENGLISH);  
    sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));  
    this.commitDate = sdf.format(d);  
    this.parent = "";  
    this.hashCodeCommit = Utils.sha1(this.message, this.commitDate);  
}  
  
public Commit(String message, String parent) {  
    this.message = message;  
    this.parent = parent;  
    this.mergeMessage = "";  
    Date d = new Date();  
    SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss yyyy Z", Locale.ENGLISH);  
    sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));  
    this.commitDate = sdf.format(d);  
    hashCodeCommit = Utils.sha1(this.message, this.commitDate, this.parent);  
}  
  
public Commit(String message, String parent, String mergeMessage, String parent2) {  
    this.message = message;  
    this.parent = parent;  
    this.mergeMessage = mergeMessage;  
    this.parent2 = parent2;  
    Date d = new Date();  
    SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss yyyy Z", Locale.ENGLISH);  
    sdf.setTimeZone(TimeZone.getTimeZone("GMT-8:00"));  
    this.commitDate = sdf.format(d);  
    hashCodeCommit = Utils.sha1(this.message, this.commitDate, this.parent, this.mergeMessage);  
}  
  
public boolean isTracked(String fileName, String fileHash) {  
	return fileHashcode.containsKey(fileName) && fileHashcode.get(fileName).equals(fileHash);  
}  
  
public HashMap<String, String> getFileHashcode() {  
    return this.fileHashcode;  
}  
  
public void setFileHashcode(HashMap<String, String> fileHashcode) {  
    this.fileHashcode = fileHashcode;  
}  
  
public void addFileHashcode(String filename, String hashcode) {  
    this.fileHashcode.put(filename, hashcode);  
}  
  
public String getHashcodeCommit() {  
    return this.hashCodeCommit;  
}  
  
public String getMessage() {  
    return this.message;  
}  
  
public String getDate() {  
    return this.commitDate;  
}  
  
public String getParent() {  
    if (Objects.equals(this.parent, "")) {  
        return null;  
    }  
    return this.parent;  
}  
  
public void commit() throws IOException {  
    File commitFile = Utils.join(Repository.COMMIT, this.getHashcodeCommit());  
    commitFile.createNewFile();  
    Utils.writeObject(commitFile, this);  
}
```
## Repository

### Fields
个人感觉我的注释写的够清楚了(赞赏).
文件系统:
```Java
/* The current working directory. */  
public static final File CWD = new File(System.getProperty("user.dir"));  
/* The .gitlet directory. */  
public static final File GITLET_DIR = join(CWD, ".gitlet");  
/* The staging */  
public static final File STAGING_AREA = join(GITLET_DIR, "staging");  
public static final File RM_AREA = join(GITLET_DIR, "rm");  
//Each constant that needs to be saved  
//all commits  
public static final File COMMIT = Utils.join(Repository.GITLET_DIR, "commit");  
//HEAD commit  
public static final File HEAD_FILE = join(GITLET_DIR, "HEAD");  
//hashmap about commitId to commit  
public static final File COMMITS_FILE = join(GITLET_DIR, "commits");  
//hashmap about filename to file a byte array  
public static final File BLOBS_FILE = join(GITLET_DIR, "blobs");  
//hashmap about branch name to branch  
public static final File BRANCHES_FILE = join(GITLET_DIR, "branches");  
//current branch  
public static final File BRANCH_FILE = join(GITLET_DIR, "branch");
```
变量:
```Java
//Commit hash value to commit mapping  
private static HashMap<String, Commit> commits = new HashMap<>();  
//current commit  
private static Commit HEAD;  
//current branch  
private static class Branch implements Serializable {  
    private final String name;  
    private Commit commit;  
    Branch(String name, Commit commit) {  
        this.name = name;  
        this.commit = commit;  
    }  
}  
private static Branch currentBranch;  
//branches  
private static HashMap<String, Branch> branches = new HashMap<>();  
//string is file hash value, byte[] is file content  
private static HashMap<String, byte[]> blobs = new HashMap<>();
```

### Functions
对于文件的处理, `createFile` `readAll`和`saveAll`用来一键创建,读取和保存.
#### `init`:
这个没什么难度,创建一些文件,进行一个初始提交就可以了.
```Java
public static void init() throws IOException {  
    if (!GITLET_DIR.exists()) {  
        GITLET_DIR.mkdir();  
    } else {  
        System.out.println("A Gitlet version-control system "  
                + "already exists in the current directory.");  
        return;  
    }  
    createFile();  
    //first commit  
    Commit firstCommit = new Commit();  
    HEAD = firstCommit;  
    firstCommit.commit();  
    commits.put(firstCommit.getHashcodeCommit(), firstCommit);  
    //default branch name is master  
    Branch master = new Branch("master", firstCommit);  
    currentBranch = master;  
    branches.put("master", master);  
    saveAll();  
}
```
#### `add`:
这个值得一提的是需要同时处理两种暂存区:添加和删除,也就是如果我们要添加的文件就在删除区的话,我们要进行一个"unremove"操作,把他从删除区移除.其他的都很好理解,在blobs表中创建一个副本,然后保存blobs文件.把本地文件上传到添加暂存区.
```Java
@SuppressWarnings("unchecked")  
public static void add(String file) throws IOException {  
    blobs =  readObject(BLOBS_FILE, HashMap.class);  
    HEAD = readObject(HEAD_FILE, Commit.class);  
    //if file in rm stage, then "unremove"  
    List<String> rm = plainFilenamesIn(RM_AREA);  
    if (rm != null) {  
        for (String f : rm) {  
            if (f.equals(file)) {  
                File beDeleted = join(RM_AREA, f);  
                beDeleted.delete();  
                return;  
            }  
        }  
    }  
    //find a local file  
    File add = join(CWD, file);  
    if (!add.exists()) {  
        System.out.println("File does not exist.");  
        return;  
    }  
    String addHash = sha1((Object) readContents(add));  
    //file equal HEAD's file  
    if (HEAD.getFileHashcode().containsKey(file)) {  
        if (HEAD.getFileHashcode().get(file).equals(addHash)) {  
            return;  
        }  
    }  
    //create the file in stage area  
    File addStage = join(STAGING_AREA, file);  
    writeContents(addStage, (Object) readContents(add));  
    addStage.createNewFile();  
    if (!blobs.containsKey(addHash)) {  
        blobs.put(addHash, readContents(add));  
    }  
    writeObject(BLOBS_FILE, blobs);  
}
```
#### `commit`:
这是一个涉及到很多部分的操作,如果是正常的提交,那就创建正常的Commit,如果是从merge来的提交,就需要创建mergeCommit了.
判断两个暂存区是否为空,如果不为空就进行add&remove操作,并且清理两个暂存区.
在添加时还要判断这个更新是否是有效的,如果内容没有改变就不进行添加.
```Java
public static void commit(String ... message) throws IOException {  
    readAll();  
    String parentHash = HEAD.getHashcodeCommit();  
    Commit commit = new Commit();  
    if (message.length == 1) {  
        commit = new Commit(message[0], parentHash);  
    }  
    if (message.length == 3) {  
        commit = new Commit(message[0], parentHash, message[1], message[2]);  
    }  
    //Defaults to the same file as the parent commit  
    commit.setFileHashcode(HEAD.getFileHashcode());  
    //get all filenames in stage  
    List<String> hashList = plainFilenamesIn(STAGING_AREA);  
    List<String> hashListRm = plainFilenamesIn(RM_AREA);  
    if (hashList != null  
            && hashListRm != null  
            && hashList.isEmpty()  
            && hashListRm.isEmpty()) {  
        System.out.println("No changes added to the commit.");  
    }  
    //clear add stage  
    if (hashList != null) {  
        for (String s : hashList) {  
            //whether you find  
            boolean flag = false;  
            File file = join(STAGING_AREA, s);  
            String fileHash = sha1((Object) readContents(file));  
            //Determine whether the file hash corresponding  
            if (commit.getFileHashcode().isEmpty()) {  
                flag = true;  
                commit.addFileHashcode(s, fileHash);  
                file.delete();  
            } else {  
                //key is filename  
                for (String key : commit.getFileHashcode().keySet()) {  
                    //find equal filename  
                    if (s.equals(key)) {  
                        commit.addFileHashcode(key, fileHash);  
                        flag = true;  
                        file.delete();  
                    }  
                }  
            }  
            //not find and not null  
            if (!flag) {  
                commit.addFileHashcode(s, fileHash);  
                file.delete();  
            }  
        }  
    }  
    //clear rm stage  
    if (hashListRm != null) {  
        for (String r : hashListRm) {  
            commit.getFileHashcode().remove(r);  
            File rmF = join(RM_AREA, r);  
            rmF.delete();  
        }  
    }  
    //save  
    commit.commit();  
    HEAD = commit;  
    currentBranch.commit = commit;  
    //update  
    branches.put(currentBranch.name, currentBranch);  
    commits.put(commit.getHashcodeCommit(), commit);  
    saveAll();
}
```
#### `log & global-log`:
一个是只打印当前分支提交的信息,一个是打印所有提交的信息.
创建一个辅助打印函数,然后从HEAD开始向上查询或者直接遍历commits即可.
```Java
@SuppressWarnings("unchecked")  
public static void log() {  
    HEAD = readObject(HEAD_FILE, Commit.class);  
    commits = readObject(COMMITS_FILE, HashMap.class);  
    while (HEAD != null) {  
        printCommit();  
        HEAD = (Commit) commits.get(HEAD.getParent());  
    }  
}
```
```Java
//print all commit  
@SuppressWarnings("unchecked")  
public static void logGlobal() {  
    List<String> commitList = plainFilenamesIn(COMMIT);  
    commits = readObject(COMMITS_FILE, HashMap.class);  
    if (commitList != null) {  
        for (String s : commitList) {  
            Commit commit = commits.get(s);  
            printCommit(commit);  
        }  
    }  
}
```
#### `checkout`:
三种情况,写三个函数.后面的命令会频繁用到.
首先来看第一种情况,这种情况比较简单,我们只需要判断HEAD中是否含有指定文件,若有就把它checkout到CWD.
然后来看第二种情况,第一步是判断传过来的是不是shortId,不要误报错.然后我们就需要从指定提交中获得该文件,但是如果存在覆盖未追踪的文件的情况,必须报错返回.
最后一种情况是得到指定分支中的所有文件,那么我们就可以先遍历指定Branch,然后就可以使用我们在第二种情况创建的函数来检出所有文件.
```Java
//checkout HEAD file to CWD  
@SuppressWarnings("unchecked")  
public static void checkout(String file) throws IOException {  
    HEAD = readObject(HEAD_FILE, Commit.class);  
    blobs = readObject(BLOBS_FILE, HashMap.class);  
    File checkoutFile = join(CWD, file);  
    //Determine whether there are files to be checked out  
    if (!HEAD.getFileHashcode().containsKey(file)) {  
        System.out.println("File does not exist in that commit.");  
        return;  
    }  
    //Get the file and write it  
    String checkHash = HEAD.getFileHashcode().get(file);  
    byte[] checkFile = blobs.get(checkHash);  
    writeContents(checkoutFile, (Object) checkFile);  
    checkoutFile.createNewFile();  
}  
  
//checkout commit corresponds commitId 's file to CWD  
public static void checkoutCommit(String commitId, String file) throws IOException {  
    readAll();  
    HashMap<String, String> shortId = new HashMap<>();  
    for (String s : commits.keySet()) {  
        String shortI = getShortId(s);  
        shortId.put(shortI, s);  
    }  
    if (shortId.containsKey(commitId)) {  
        commitId = shortId.get(commitId);  
    }  
    //Whether to include this commit  
    if (!commits.containsKey(commitId) && !shortId.containsKey(commitId)) {  
        System.out.println("No commit with that id exists.");  
        return;  
    }  
    Commit checkCommit = commits.get(commitId);  
    //whether this commit have the file  
    if (!checkCommit.getFileHashcode().containsKey(file)) {  
        System.out.println("File does not exist in that commit.");  
        return;  
    }  
    String checkfileHash = checkCommit.getFileHashcode().get(file);  
    File cwdFile = join(CWD, file);  
    isUntracked(file, checkfileHash);  
    //get file content and write in CWD  
    byte[] checkByte = blobs.get(checkfileHash);  
    cwdFile.createNewFile();  
    writeContents(cwdFile, (Object) checkByte);  
}  
  
private static void isUntracked(String file, String checkfileHash) {  
    File cwdFile = join(CWD, file);  
    String cwdHash = null;  
    if (cwdFile.exists()) {  
        cwdHash = sha1((Object) readContents(cwdFile));  
    }  
    if (!checkfileHash.equals(cwdHash)  
            && !isTracked(file, cwdHash)  
            && cwdHash != null) {  
        System.out.println("There is an untracked file in the way;"  
                + " delete it, or add and commit it first.");  
        System.exit(0);  
    }  
}  
  
@SuppressWarnings("unchecked")  
public static void checkBranch(String branch) throws IOException {  
    HEAD = readObject(HEAD_FILE, Commit.class);  
    currentBranch = readObject(BRANCH_FILE, Branch.class);  
    branches = readObject(BRANCHES_FILE, HashMap.class);  
    Branch giveBranch = branches.get(branch);  
    if (!branches.containsKey(branch)) {  
        System.out.println("No such branch exists.");  
        return;  
    }  
    if (giveBranch.name.equals(currentBranch.name)) {  
        System.out.println("No need to checkout the current branch.");  
        return;  
    }  
    List<String> cwd = plainFilenamesIn(CWD);  
    if (cwd != null) {  
        for (String s : cwd) {  
            File cwdF = join(CWD, s);  
            String cwdHash = sha1((Object) readContents(cwdF));  
            if (HEAD.getFileHashcode().containsValue(cwdHash)  
                    && !giveBranch.commit.getFileHashcode().containsKey(s)) {  
                cwdF.delete();  
            }  
        }  
    }  
    for (String key : giveBranch.commit.getFileHashcode().keySet()) {  
        checkoutCommit(giveBranch.commit.getHashcodeCommit(), key);  
    }  
    currentBranch = branches.get(branch);  
    HEAD = branches.get(branch).commit;  
    branches.put(currentBranch.name, currentBranch);  
    writeObject(HEAD_FILE, HEAD);  
    writeObject(BRANCH_FILE, currentBranch);  
    writeObject(BRANCHES_FILE, branches);  
}
```