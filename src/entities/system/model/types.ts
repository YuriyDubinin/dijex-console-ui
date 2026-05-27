/** Снимок состояния системы из GET /api/system. */

export type AppEnv = 'production' | 'development' | string;

export type SystemApp = {
  name: string;
  env: AppEnv;
  version: string;
  started_at: string;
  uptime_seconds: number;
  http_port: string;
};

export type SystemHost = {
  hostname: string;
  fqdn: string;
  os: 'linux' | 'darwin' | 'windows' | string;
  platform: string;
  platform_family: string;
  platform_version: string;
  kernel_version: string;
  kernel_arch: string;
  virtualization_system: string;
  virtualization_role: string;
  boot_time: string;
  uptime_seconds: number;
  host_id: string;
  timezone: string;
};

export type SystemCpu = {
  model_name: string;
  vendor: string;
  family: string;
  model: string;
  stepping: number;
  physical_cores: number;
  logical_cores: number;
  mhz: number;
  cache_size_kb: number;
  flags?: string[];
  usage_percent: number;
  per_core_usage_percent: number[];
  load_avg_1: number;
  load_avg_5: number;
  load_avg_15: number;
};

export type SystemMemoryVirtual = {
  total_bytes: number;
  available_bytes: number;
  used_bytes: number;
  free_bytes: number;
  cached_bytes: number;
  buffers_bytes: number;
  shared_bytes: number;
  slab_bytes: number;
  used_percent: number;
};

export type SystemMemorySwap = {
  total_bytes: number;
  used_bytes: number;
  free_bytes: number;
  used_percent: number;
};

export type SystemMemory = {
  virtual: SystemMemoryVirtual;
  swap: SystemMemorySwap;
};

export type SystemDiskPartition = {
  device: string;
  mountpoint: string;
  fstype: string;
  opts: string;
  total_bytes: number;
  used_bytes: number;
  free_bytes: number;
  used_percent: number;
  inodes_total: number;
  inodes_used: number;
  inodes_free: number;
};

export type SystemDiskIoCounter = {
  read_count: number;
  write_count: number;
  read_bytes: number;
  write_bytes: number;
  read_time_ms: number;
  write_time_ms: number;
  io_time_ms: number;
};

export type SystemDisks = {
  partitions: SystemDiskPartition[];
  io_counters?: Record<string, SystemDiskIoCounter>;
};

export type SystemNetAddress = {
  addr: string;
  family: 'ipv4' | 'ipv6' | string;
};

export type SystemNetInterface = {
  name: string;
  hardware_addr: string;
  mtu: number;
  flags: string[];
  addresses: SystemNetAddress[];
};

export type SystemNetIoCounter = {
  name: string;
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  err_in: number;
  err_out: number;
  drop_in: number;
  drop_out: number;
};

export type SystemNetwork = {
  interfaces: SystemNetInterface[];
  io_counters: SystemNetIoCounter[];
  connections_count: number;
};

export type SystemProcess = {
  pid: number;
  ppid: number;
  name: string;
  exe: string;
  cmdline: string;
  cwd: string;
  username: string;
  started_at: string;
  uptime_seconds: number;
  memory_rss_bytes: number;
  memory_vms_bytes: number;
  memory_percent: number;
  cpu_percent: number;
  num_threads: number;
  num_fds: number;
  nice: number;
};

export type SystemGoMemory = {
  alloc_bytes: number;
  total_alloc_bytes: number;
  sys_bytes: number;
  heap_alloc_bytes: number;
  heap_sys_bytes: number;
  heap_idle_bytes: number;
  heap_inuse_bytes: number;
  heap_objects: number;
  stack_inuse_bytes: number;
  stack_sys_bytes: number;
  next_gc_bytes: number;
  mallocs: number;
  frees: number;
};

export type SystemGoGc = {
  num_gc: number;
  num_forced_gc: number;
  last_gc_at: string;
  total_pause_ns: number;
  cpu_fraction: number;
  gc_percent: number;
};

export type SystemGoBuildInfo = {
  main_module: string;
  main_version: string;
  vcs_revision: string;
  vcs_time: string;
  vcs_modified: boolean;
};

export type SystemGoRuntime = {
  version: string;
  compiler: string;
  goos: string;
  goarch: string;
  goroot: string;
  gomaxprocs: number;
  num_goroutines: number;
  num_cgo_calls: number;
  memory: SystemGoMemory;
  gc: SystemGoGc;
  build_info: SystemGoBuildInfo;
};

export type SystemDbPool = {
  max_conns: number;
  total_conns: number;
  idle_conns: number;
  acquired_conns: number;
  constructing_conns: number;
  acquire_count: number;
  acquire_duration_ns: number;
  empty_acquire_count: number;
  canceled_acquire_count: number;
};

export type SystemDbServer = {
  current_database: string;
  database_size_bytes: number;
  active_connections: number;
  max_connections: number;
  server_started_at: string;
};

export type SystemDatabase = {
  reachable: boolean;
  ping_latency_ms: number;
  version: string;
  pool: SystemDbPool;
  server: SystemDbServer;
};

export type SystemError = {
  section: string;
  message: string;
};

export type SystemSnapshot = {
  collected_at: string;
  collection_duration_ms: number;
  app: SystemApp;
  host: SystemHost;
  cpu: SystemCpu;
  memory: SystemMemory;
  disks: SystemDisks;
  network: SystemNetwork;
  process: SystemProcess;
  go_runtime: SystemGoRuntime;
  database: SystemDatabase;
  errors: SystemError[];
};
