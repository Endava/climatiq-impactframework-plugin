# Climatiq Impact Framework Plugin

The `Climatiq` plugin enables users to pass input utilisation parameters for VMs, CPU, memory and storage to Climatiq's cloud computing API. The plugin will then return output parameters for energy use, and operational and embodied carbon emissions. Note: The plugin uses the batch version of the APIs, which means that each element in child inputs should be on the same cloud/vendor, and of same resource type, ie. 'aws' and 'ssd'.

### 1. Add credentials to `.env`

To utilize `Climatiq`, you'll need to append a key-value pair for your `Climatiq` credentials:

```txt
CLIMATIQ_API_KEY=your_api_key
```

Replace your_api_key with your actual Climatiq API key. Remember to keep this file secure and never expose it publicly, as it contains sensitive information that grants access to your Climatiq API quota.

## Node config

- `use-energy-sum`: Setting determines whether to calculate and output the sum of energy across CPU and memory components
- `endpoint`: Optional setting to specify the Cloud calculation endpoint: vm-instance, cpu, memory, storage. If not set, the endpoint is inferred from parameters.
- `use-carbon-sum`: Setting specifies whether to compute and output the sum of operational and embodied carbon emissions
- `include-carbon-emissions`: Indicates whether to include carbon emissions data in the output.
- `include-carbon-intensity`: Indicates whether to include carbon intensity data in the output.

## Inputs

The Climatiq plugin determines which API to use depending on the input parameters. All types require the following input parameters:
- `timestamp`: Provide an ISO8601 `timestamp` representing the beginning of your observation period. By adding the `duration` to this initial `timestamp`, we determine the end time of your observation period.
- `duration`: Specify the `duration` of your observation period in seconds. This `duration` value is added to the `timestamp` to calculate the end time of your observation period.
- `location`: The cloud region where the resource is located, i.e. eu-central-1
- `cloud/vendor`: The following cloud vendors are supported { aws | azure | gcp }

### For instance calculations, the following parameters are required:
- `cloud/instance-type`: String containing the name of the instance type or SKU for this resource e.g., a1.medium
- `cpu/utilization`: Number specifying the CPU utilisation as a percentage value (0-100)

### For CPU calculations, the following parameters are required:
- `vcpus-allocated`: Number of virtual CPUs you are calculating for,
- `cpu/utilization`: The average load across all of your vCPU's specified as a percentage value (0-100)

### For Memory calculations, the following parameter is required:
'ram-alloc': Number specifying the amount of RAM allocated in GB

### For Storage calculations, the following parameters are required:
- `storage/type`: A string specifying either 'ssd' or 'hdd' storage
- `storage/capacity`: Number specifying the volume's capacity in GB

Below is a manifest example for a VM instance calculation:

```yaml
name: Climatiq VM Test
description: Gets VM instance calculations from Climatiq
tags: null
initialize:
  plugins:
    climatiq-plugin:
      method: ClimatiqCalculator
      path: climatiq-plugin
      global-config:
        use-energy-sum: false
        use-carbon-sum: true
        include-carbon-emissions: false
        include-carbon-intensity: false
  outputs:
    - yaml
if-version: v0.3.1
tree:
  children:
    child:
      pipeline:
        - climatiq-plugin
      children:
        test-vms:
          inputs:
            - timestamp: '2024-03-20T00:00:00.000Z'
              duration: 3600
              cloud/vendor: aws
              cpu/utilization: 50
              cloud/instance-type: r5.2xlarge
              location: eu-central-1
```

## Outputs

The Climatiq plugin will enrich your inputs with calculations from Climatiq's cloud-calculation APIs, with parameters according the calculation type (instance, cpu, memory, storage). Note: For storage, only operational emissions are available.

For all calculations:
- `carbon-intensity`: Electrical grid carbon intensity in gCO2e/kHw when include-carbon-intensity is true
- `carbon`: Sum of operational and embodied CO2e emissions in kgCOe2 when use-carbon-sum and include-carbon-emissions are true
or
- `carbon-operational`: Operational CO2e emissions in kgCOe2 when include-carbon-emissions is true
- `carbon-embodied`: Embodied CO2e emissions in kgCOe2 when include-carbon-emissions is true

### For instance calculations, the following outputs are returned
- `energy`: Sum of cpu and memory energy consumed in kWh when use-energy-sum is true
or
- `cpu/energy`: CPU energy consumed in kWh
- `memory/energy`: Memory energy consumed in kWh

### For CPU calculations, the following outputs are returned
- `cpu/energy`: CPU energy consumed in kWh

### For Memory calculations, the following outputs are returned
- `memory/energy`: Memory energy consumed in kWh

### For Storage calculations, the following outputs are returned
- `energy`: Energy consumed in kWh

Below is the corresponding output for the vm instance calculation:

```yaml
name: Climatiq VM Test
description: Gets VM instance calculations from Climatiq
tags: null
initialize:
  plugins:
    climatiq-plugin:
      path: climatiq-plugin
      method: ClimatiqCalculator
      global-config:
        use-energy-sum: false
        use-carbon-sum: true
        include-carbon-emissions: false
        include-carbon-intensity: false
  outputs:
    - yaml
tree:
  children:
    child:
      pipeline:
        - climatiq-plugin
      children:
        test-vms:
          inputs:
            - timestamp: '2024-03-20T00:00:00.000Z'
              duration: 3600
              cloud/vendor: aws
              cpu/utilization: 50
              cloud/instance-type: r5.2xlarge
              location: eu-central-1
          outputs:
            - timestamp: '2024-03-20T00:00:00.000Z'
              duration: 3600
              cloud/vendor: aws
              cpu/utilization: 50
              cloud/instance-type: r5.2xlarge
              location: eu-central-1
              cpu/energy: 0.019249600000000002
              memory/energy: 0.03057466958938112
```
