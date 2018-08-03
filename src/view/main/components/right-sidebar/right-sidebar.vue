<template>
  <div class="tip-common">
    <Poptip placement="bottom-end">
      <Icon type="ios-switch" :size="22"></Icon>
      <div slot="content">
        <CellGroup  style="width: 300px;">
          <Cell title="Only show titles"/>
          <Cell title="Display label content" label="label content"/>
          <Cell title="Display right content" extra="details"/>
          <Cell title="Link" extra="details" to="/components/button"/>
          <Cell title="Open link in new window" to="/components/button" target="_blank"/>
          <Cell title="Disabled" disabled/>
          <Cell title="Selected" selected/>
          <Cell title="With Badge" to="/components/badge">
            <Badge :count="10" slot="extra"/>
          </Cell>
          <Cell title="With Switch">
            <Switch  slot="extra"/>
          </Cell>
        </CellGroup>
      </div>
    </Poptip>
  </div>
</template>

<script>
  export default {
    name: 'right-sidebar',
    props: {
    },
    methods: {}
  }
</script>

<style>

</style>
